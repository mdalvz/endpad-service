import { Session } from './Session';

export class Manager {

  public static readonly instance = new Manager();

  private readonly sessions: Map<string, Session>;

  public constructor() {
    this.sessions = new Map();
  }

  public createSession(): Session {
    let session = new Session();
    this.sessions.set(session.sessionId, session);
    return session;
  }

  public getSession(sessionId: string): Session {
    let session = this.sessions.get(sessionId);
    if (session === undefined) {
      throw new Error('Session with id ' + sessionId + ' not found');
    }
    return session;
  }

}
