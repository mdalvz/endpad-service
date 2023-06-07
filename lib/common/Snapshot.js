"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snapshot = exports.SnapshotUser = void 0;
const endpad_model_1 = require("endpad-model");
class SnapshotUser {
    constructor(userId, active, index, size) {
        this.userId = userId;
        this.active = active;
        this.index = index;
        this.size = size;
    }
}
exports.SnapshotUser = SnapshotUser;
class Snapshot {
    constructor(eventId, data, users) {
        this.eventId = eventId;
        this.data = data;
        this.users = users;
    }
    applyEvent(event) {
        switch (event.type) {
            case endpad_model_1.RemoteEventType.ACTIVE:
                return new Snapshot(event.eventId, this.data, this.users.map((e, i, a) => {
                    if (e.userId === event.userId) {
                        return new SnapshotUser(e.userId, event.active, e.index, e.size);
                    }
                    else {
                        return e;
                    }
                }));
            case endpad_model_1.RemoteEventType.CONNECT:
                return new Snapshot(event.eventId, this.data, this.users.concat([
                    new SnapshotUser(event.userId, false, 0, 0)
                ]));
            case endpad_model_1.RemoteEventType.SELECT:
                return new Snapshot(event.eventId, this.data, this.users.map((e, i, a) => {
                    if (e.userId === event.userId) {
                        return new SnapshotUser(e.userId, e.active, event.index, event.size);
                    }
                    else {
                        return e;
                    }
                }));
            case endpad_model_1.RemoteEventType.DELETE:
                return new Snapshot(event.eventId, this.data.slice(0, event.index) + this.data.slice(event.index + event.size), [...this.users]);
            case endpad_model_1.RemoteEventType.INSERT:
                return new Snapshot(event.eventId, this.data.slice(0, event.index) + event.data + this.data.slice(event.index), [...this.users]);
            case endpad_model_1.RemoteEventType.RESET:
                return new Snapshot(event.eventId, event.data, event.users.map((e, i, a) => {
                    return new SnapshotUser(e.userId, e.active, e.index, e.size);
                }));
        }
    }
}
exports.Snapshot = Snapshot;
