import { RemoteEvent, LocalEvent } from 'endpad-model';
import { User } from './User';
import { Snapshot } from './Snapshot';
export declare class Session {
    readonly sessionId: string;
    snapshot: Snapshot;
    users: User[];
    usersMap: Map<string, number>;
    events: RemoteEvent[];
    eventsMap: Map<string, number>;
    constructor();
    createUser(): User;
    getUser(userId: string, token?: string): User;
    getEvents(eventId: string | null): RemoteEvent[];
    pushEvents(userId: string, eventId: string, events: LocalEvent[]): boolean;
    private generateResetEvent;
    private generateResetSnapshot;
    private applyBaseInsertEvent;
    private applyBaseDeleteEvent;
    private applyInsertIndexTransform;
    private applyDeleteIndexTransform;
    private generateUsersMap;
    private generateEventsMap;
    private pushInsertEvent;
    private pushDeleteEvent;
    private pushSelectEvent;
    private pushConnectEvent;
    private pushActiveEvent;
}
