import { generateLongIdentifier } from './Identifier';
import { RemoteEvent, RemoteEventType } from 'endpad-model';

export class SnapshotUser {

  public readonly userId: string;

  public readonly active: boolean;

  public readonly index: number;

  public readonly size: number;

  public constructor(
    userId: string,
    active: boolean,
    index: number,
    size: number) {

    this.userId = userId;
    this.active = active;
    this.index = index;
    this.size = size;
  }

}

export class Snapshot {

  public readonly eventId: string;

  public readonly data: string;

  public readonly users: SnapshotUser[];

  public constructor(
    eventId: string,
    data: string, 
    users: SnapshotUser[]) {

    this.eventId = eventId;
    this.data = data;
    this.users = users;
  }

  public applyEvent(event: RemoteEvent): Snapshot {
    switch (event.type) {
      case RemoteEventType.ACTIVE:
        return new Snapshot(event.eventId, this.data, this.users.map((e, i, a) => {
          if (e.userId === event.userId) {
            return new SnapshotUser(e.userId, event.active, e.index, e.size);
          } else {
            return e;
          }
        }));
      case RemoteEventType.CONNECT:
        return new Snapshot(event.eventId, this.data, this.users.concat([
          new SnapshotUser(event.userId, false, 0, 0)
        ]));
      case RemoteEventType.SELECT:
        return new Snapshot(event.eventId, this.data, this.users.map((e, i, a) => {
          if (e.userId === event.userId) {
            return new SnapshotUser(e.userId, e.active, event.index, event.size);
          } else {
            return e;
          }
        }));
      case RemoteEventType.DELETE:
        return new Snapshot(
          event.eventId, 
          this.data.slice(0, event.index) + this.data.slice(event.index + event.size), 
          [...this.users]);
      case RemoteEventType.INSERT:
        return new Snapshot(
          event.eventId, 
          this.data.slice(0, event.index) + event.data + this.data.slice(event.index), 
          [...this.users]);
      case RemoteEventType.RESET:
        return new Snapshot(event.eventId, event.data, event.users.map((e, i, a) => {
          return new SnapshotUser(e.userId, e.active, e.index, e.size);
        }));
    }
  }

}
