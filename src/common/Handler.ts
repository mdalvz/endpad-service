import { z } from 'zod';

export function operationHandler<TRequest, TResponse>(
  fn: (request: TRequest) => Promise<TResponse>,
  requestSchema: z.ZodType<TRequest>
): (request: any, response: any) => void {
  return async function (request: any, response: any) {
    try {
      let requestBody = requestSchema.parse(request.body);
      try {
        let responseBody = await fn(requestBody);
        response.status(200);
        response.json(responseBody);
        return;
      } catch (error) {
        if (error instanceof Error) {
          response.status(400);
          response.send(error.message);
          return;
        } else {
          response.status(500);
          response.send('Internal server error');
          return;
        }
      }
    } catch (_) {
      response.status(400);
      response.send('Invalid request type');
      return;
    }
  }
}
