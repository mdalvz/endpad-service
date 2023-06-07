import { z } from 'zod';
export declare function operationHandler<TRequest, TResponse>(fn: (request: TRequest) => Promise<TResponse>, requestSchema: z.ZodType<TRequest>): (request: any, response: any) => void;
