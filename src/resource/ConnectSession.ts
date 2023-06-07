import {
  ConnectSessionRequest,
  ConnectSessionRequestSchema,
  ConnectSessionResponse
} from 'endpad-model';
import { operationHandler } from '../common/Handler';
import { Manager } from '../common/Manager';

export async function connectSession(request: ConnectSessionRequest): Promise<ConnectSessionResponse> {
  let session = Manager.instance.getSession(request.sessionId);
  let { userId, token } = session.createUser();
  return { userId, token };
}

export const connectSessionHandler = operationHandler(connectSession, ConnectSessionRequestSchema);
