import { Session } from './Session';
export declare class Manager {
    static readonly instance: Manager;
    private readonly sessions;
    constructor();
    createSession(): Session;
    getSession(sessionId: string): Session;
}
