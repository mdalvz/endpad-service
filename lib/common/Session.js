"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const endpad_model_1 = require("endpad-model");
const User_1 = require("./User");
const Snapshot_1 = require("./Snapshot");
const Identifier_1 = require("./Identifier");
class Session {
    constructor() {
        this.sessionId = (0, Identifier_1.generateShortIdentifier)();
        this.snapshot = new Snapshot_1.Snapshot((0, Identifier_1.generateLongIdentifier)(), '', []);
        this.users = [];
        this.events = [];
        this.usersMap = new Map();
        this.eventsMap = new Map();
    }
    createUser() {
        let user = new User_1.User();
        this.users.push(user);
        this.generateUsersMap();
        this.pushConnectEvent(user.userId);
        this.pushActiveEvent(user.userId, user.active);
        this.generateEventsMap();
        return user;
    }
    getUser(userId, token) {
        let index = this.usersMap.get(userId);
        if (index !== undefined) {
            let user = this.users[index];
            if (token !== undefined && user.token !== token) {
                throw new Error('User token ' + token + ' is invalid');
            }
            return user;
        }
        else {
            throw new Error('User with id ' + userId + ' not found');
        }
    }
    getEvents(eventId) {
        if (eventId === null) {
            return this.generateResetEvent();
        }
        let baseStart = this.eventsMap.get(eventId);
        if (baseStart === undefined) {
            return this.generateResetEvent();
        }
        let result = [];
        for (let i = baseStart + 1; i < this.events.length; ++i) {
            result.push(this.events[i]);
        }
        return result;
    }
    pushEvents(userId, eventId, events) {
        let baseStart = this.eventsMap.get(eventId);
        if (baseStart === undefined) {
            return false;
        }
        for (let i = baseStart + 1; i < this.events.length; ++i) {
            for (let j = 0; j < events.length; ++i) {
                let baseEvent = this.events[i];
                let event = events[j];
                switch (baseEvent.type) {
                    case endpad_model_1.RemoteEventType.RESET:
                        return false;
                    case endpad_model_1.RemoteEventType.DELETE:
                        this.applyBaseDeleteEvent(baseEvent, event);
                        break;
                    case endpad_model_1.RemoteEventType.INSERT:
                        this.applyBaseInsertEvent(baseEvent, event);
                        break;
                }
            }
        }
        for (let i = 0; i < events.length; ++i) {
            let event = events[i];
            switch (event.type) {
                case endpad_model_1.LocalEventType.DELETE:
                    this.pushDeleteEvent(userId, event);
                    break;
                case endpad_model_1.LocalEventType.INSERT:
                    this.pushInsertEvent(userId, event);
                    break;
                case endpad_model_1.LocalEventType.SELECT:
                    this.pushSelectEvent(userId, event);
                    break;
            }
        }
        this.generateEventsMap();
        return true;
    }
    generateResetEvent() {
        let resetSnapshot = this.generateResetSnapshot();
        let resetEvent = {
            type: endpad_model_1.RemoteEventType.RESET,
            data: resetSnapshot.data,
            eventId: resetSnapshot.eventId,
            users: resetSnapshot.users.map((e, i, a) => {
                return {
                    userId: e.userId,
                    active: e.active,
                    index: e.index,
                    size: e.size
                };
            })
        };
        return [resetEvent];
    }
    generateResetSnapshot() {
        let result = this.snapshot;
        for (let i = 0; i < this.events.length; ++i) {
            result = result.applyEvent(this.events[i]);
        }
        return result;
    }
    applyBaseInsertEvent(baseEvent, event) {
        switch (event.type) {
            case endpad_model_1.LocalEventType.INSERT:
                event.index = this.applyInsertIndexTransform(baseEvent, event.index);
                break;
            case endpad_model_1.LocalEventType.DELETE:
            case endpad_model_1.LocalEventType.SELECT:
                let start = event.index;
                let end = start + event.size;
                event.index = this.applyInsertIndexTransform(baseEvent, start);
                event.size = this.applyInsertIndexTransform(baseEvent, end) - event.index;
                break;
        }
    }
    applyBaseDeleteEvent(baseEvent, event) {
        switch (event.type) {
            case endpad_model_1.LocalEventType.INSERT:
                event.index = this.applyDeleteIndexTransform(baseEvent, event.index);
                break;
            case endpad_model_1.LocalEventType.DELETE:
            case endpad_model_1.LocalEventType.SELECT:
                let start = event.index;
                let end = start + event.size;
                event.index = this.applyDeleteIndexTransform(baseEvent, start);
                event.size = this.applyDeleteIndexTransform(baseEvent, end) - event.index;
                break;
        }
    }
    applyInsertIndexTransform(baseEvent, index) {
        if (baseEvent.index <= index) {
            return index + baseEvent.data.length;
        }
        else {
            return index;
        }
    }
    applyDeleteIndexTransform(baseEvent, index) {
        if (baseEvent.index > index) {
            return index;
        }
        else {
            let delta = Math.min(index - baseEvent.index, baseEvent.size);
            return index - delta;
        }
    }
    generateUsersMap() {
        this.usersMap.clear();
        for (let i = 0; i < this.users.length; ++i) {
            this.usersMap.set(this.users[i].userId, i);
        }
    }
    generateEventsMap() {
        this.eventsMap.clear();
        for (let i = 0; i < this.events.length; ++i) {
            this.eventsMap.set(this.events[i].eventId, i);
        }
    }
    pushInsertEvent(userId, localEvent) {
        let event = {
            type: endpad_model_1.RemoteEventType.INSERT,
            eventId: (0, Identifier_1.generateLongIdentifier)(),
            userId,
            index: localEvent.index,
            data: localEvent.data
        };
        this.events.push(event);
    }
    pushDeleteEvent(userId, localEvent) {
        let event = {
            type: endpad_model_1.RemoteEventType.DELETE,
            eventId: (0, Identifier_1.generateLongIdentifier)(),
            userId,
            index: localEvent.index,
            size: localEvent.size
        };
        this.events.push(event);
    }
    pushSelectEvent(userId, localEvent) {
        let event = {
            type: endpad_model_1.RemoteEventType.SELECT,
            eventId: (0, Identifier_1.generateLongIdentifier)(),
            userId,
            index: localEvent.index,
            size: localEvent.size
        };
        this.events.push(event);
    }
    pushConnectEvent(userId) {
        let event = {
            type: endpad_model_1.RemoteEventType.CONNECT,
            eventId: (0, Identifier_1.generateLongIdentifier)(),
            userId
        };
        this.events.push(event);
    }
    pushActiveEvent(userId, active) {
        let event = {
            type: endpad_model_1.RemoteEventType.ACTIVE,
            eventId: (0, Identifier_1.generateLongIdentifier)(),
            userId,
            active
        };
        this.events.push(event);
    }
}
exports.Session = Session;
