import { ConnectSessionRequest, ConnectSessionResponse } from 'endpad-model';
export declare function connectSession(request: ConnectSessionRequest): Promise<ConnectSessionResponse>;
export declare const connectSessionHandler: (request: any, response: any) => void;
