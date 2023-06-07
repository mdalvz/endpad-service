import {
  CreateSessionRequest,
  CreateSessionRequestSchema,
  CreateSessionResponse
} from 'endpad-model';
import { operationHandler } from '../common/Handler';
import { Manager } from '../common/Manager';

export async function createSession(_: CreateSessionRequest): Promise<CreateSessionResponse> {
  let { sessionId } = Manager.instance.createSession();
  return { sessionId };
}

export const createSessionHandler = operationHandler(createSession, CreateSessionRequestSchema);
