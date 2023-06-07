import {
  UpdateSessionRequest,
  UpdateSessionRequestSchema,
  UpdateSessionResponse
} from 'endpad-model';
import { operationHandler } from '../common/Handler';
import { Manager } from '../common/Manager';

export async function updateSession(request: UpdateSessionRequest): Promise<UpdateSessionResponse> {
  let session = Manager.instance.getSession(request.sessionId);
  session.getUser(request.userId, request.token);
  if (request.eventId !== null) {
    session.pushEvents(request.userId, request.eventId, request.events);
  }
  let events = session.getEvents(request.eventId);
  return { events };
}

export const updateSessionHandler = operationHandler(updateSession, UpdateSessionRequestSchema);
