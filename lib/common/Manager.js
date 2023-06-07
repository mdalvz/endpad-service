"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const Session_1 = require("./Session");
class Manager {
    constructor() {
        this.sessions = new Map();
    }
    createSession() {
        let session = new Session_1.Session();
        this.sessions.set(session.sessionId, session);
        return session;
    }
    getSession(sessionId) {
        let session = this.sessions.get(sessionId);
        if (session === undefined) {
            throw new Error('Session with id ' + sessionId + ' not found');
        }
        return session;
    }
}
exports.Manager = Manager;
Manager.instance = new Manager();
