import {
  RemoteEvent, 
  RemoteEventType,
  RemoteConnectEvent,
  RemoteActiveEvent,
  RemoteInsertEvent,
  RemoteDeleteEvent,
  RemoteSelectEvent,
  RemoteResetEvent,
  LocalInsertEvent,
  LocalDeleteEvent,
  LocalSelectEvent,
  LocalEvent,
  LocalEventType
} from 'endpad-model';
import { User } from './User';
import { Snapshot } from './Snapshot';
import { generateShortIdentifier, generateLongIdentifier } from './Identifier';

export class Session {

  public readonly sessionId: string;

  public snapshot: Snapshot;

  public users: User[];

  public usersMap: Map<string, number>;

  public events: RemoteEvent[];

  public eventsMap: Map<string, number>;

  public constructor() {
    this.sessionId = generateShortIdentifier();
    this.snapshot = new Snapshot(generateLongIdentifier(), '', []);
    this.users = [];
    this.events = [];
    this.usersMap = new Map();
    this.eventsMap = new Map();
  }

  public createUser(): User {
    let user = new User();
    this.users.push(user);
    this.generateUsersMap();
    this.pushConnectEvent(user.userId);
    this.pushActiveEvent(user.userId, user.active);
    this.generateEventsMap();
    return user;
  }

  public getUser(userId: string, token?: string): User {
    let index = this.usersMap.get(userId);
    if (index !== undefined) {
      let user = this.users[index];
      if (token !== undefined && user.token !== token) {
        throw new Error('User token ' + token + ' is invalid');
      }
      return user;
    } else {
      throw new Error('User with id ' + userId + ' not found');
    }
  }

  public getEvents(eventId: string | null): RemoteEvent[] {
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

  public pushEvents(userId: string, eventId: string, events: LocalEvent[]): boolean {
    let baseStart = this.eventsMap.get(eventId);
    if (baseStart === undefined) {
      return false;
    }
    for (let i = baseStart + 1; i < this.events.length; ++i) {
      for (let j = 0; j < events.length; ++i) {
        let baseEvent = this.events[i];
        let event = events[j];
        switch (baseEvent.type) {
          case RemoteEventType.RESET:
            return false;
          case RemoteEventType.DELETE:
            this.applyBaseDeleteEvent(baseEvent, event);
            break;
          case RemoteEventType.INSERT:
            this.applyBaseInsertEvent(baseEvent, event);
            break;
        }
      }
    }
    for (let i = 0; i < events.length; ++i) {
      let event = events[i];
      switch (event.type) {
        case LocalEventType.DELETE:
          this.pushDeleteEvent(userId, event);
          break;
        case LocalEventType.INSERT:
          this.pushInsertEvent(userId, event);
          break;
        case LocalEventType.SELECT:
          this.pushSelectEvent(userId, event);
          break;
      }
    }
    this.generateEventsMap();
    return true;
  }

  private generateResetEvent(): RemoteEvent[] {
    let resetSnapshot = this.generateResetSnapshot();
    let resetEvent: RemoteResetEvent = {
      type: RemoteEventType.RESET,
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
    return [ resetEvent ];
  }

  private generateResetSnapshot(): Snapshot {
    let result = this.snapshot;
    for (let i = 0; i < this.events.length; ++i) {
      result = result.applyEvent(this.events[i]);
    }
    return result;
  }

  private applyBaseInsertEvent(baseEvent: RemoteInsertEvent, event: LocalEvent) {
    switch (event.type) {
      case LocalEventType.INSERT:
        event.index = this.applyInsertIndexTransform(baseEvent, event.index);
        break;
      case LocalEventType.DELETE:
      case LocalEventType.SELECT:
        let start = event.index;
        let end = start + event.size;
        event.index = this.applyInsertIndexTransform(baseEvent, start);
        event.size = this.applyInsertIndexTransform(baseEvent, end) - event.index;
        break;
    }
  }

  private applyBaseDeleteEvent(baseEvent: RemoteDeleteEvent, event: LocalEvent) {
    switch (event.type) {
      case LocalEventType.INSERT:
        event.index = this.applyDeleteIndexTransform(baseEvent, event.index);
        break;
      case LocalEventType.DELETE:
      case LocalEventType.SELECT:
        let start = event.index;
        let end = start + event.size;
        event.index = this.applyDeleteIndexTransform(baseEvent, start);
        event.size = this.applyDeleteIndexTransform(baseEvent, end) - event.index;
        break;
    }
  }

  private applyInsertIndexTransform(baseEvent: RemoteInsertEvent, index: number): number {
    if (baseEvent.index <= index) {
      return index + baseEvent.data.length;
    } else {
      return index;
    }
  }

  private applyDeleteIndexTransform(baseEvent: RemoteDeleteEvent, index: number): number {
    if (baseEvent.index > index) {
      return index;
    } else {
      let delta = Math.min(index - baseEvent.index, baseEvent.size);
      return index - delta;
    }
  }

  private generateUsersMap() {
    this.usersMap.clear();
    for (let i = 0; i < this.users.length; ++i) {
      this.usersMap.set(this.users[i].userId, i);
    }
  }

  private generateEventsMap() {
    this.eventsMap.clear();
    for (let i = 0; i < this.events.length; ++i) {
      this.eventsMap.set(this.events[i].eventId, i);
    }
  }

  private pushInsertEvent(userId: string, localEvent: LocalInsertEvent) {
    let event: RemoteInsertEvent = {
      type: RemoteEventType.INSERT,
      eventId: generateLongIdentifier(),
      userId,
      index: localEvent.index,
      data: localEvent.data
    };
    this.events.push(event);
  }

  private pushDeleteEvent(userId: string, localEvent: LocalDeleteEvent) {
    let event: RemoteDeleteEvent = {
      type: RemoteEventType.DELETE,
      eventId: generateLongIdentifier(),
      userId,
      index: localEvent.index,
      size: localEvent.size
    };
    this.events.push(event);
  }

  private pushSelectEvent(userId: string, localEvent: LocalSelectEvent) {
    let event: RemoteSelectEvent = {
      type: RemoteEventType.SELECT,
      eventId: generateLongIdentifier(),
      userId,
      index: localEvent.index,
      size: localEvent.size
    };
    this.events.push(event);
  }

  private pushConnectEvent(userId: string) {
    let event: RemoteConnectEvent = {
      type: RemoteEventType.CONNECT,
      eventId: generateLongIdentifier(),
      userId
    };
    this.events.push(event);
  }

  private pushActiveEvent(userId: string, active: boolean) {
    let event: RemoteActiveEvent = {
      type: RemoteEventType.ACTIVE,
      eventId: generateLongIdentifier(),
      userId,
      active
    };
    this.events.push(event);
  }

}
