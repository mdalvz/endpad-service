import { RemoteEvent } from 'endpad-model';
export declare class SnapshotUser {
    readonly userId: string;
    readonly active: boolean;
    readonly index: number;
    readonly size: number;
    constructor(userId: string, active: boolean, index: number, size: number);
}
export declare class Snapshot {
    readonly eventId: string;
    readonly data: string;
    readonly users: SnapshotUser[];
    constructor(eventId: string, data: string, users: SnapshotUser[]);
    applyEvent(event: RemoteEvent): Snapshot;
}
