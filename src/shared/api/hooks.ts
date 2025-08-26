import { getToken } from './auth';
import { handleErrorResponse } from './errors';
import { logRequest } from './logger';

export const beforeRequestHook = async (request: Request) => {
  const token = await getToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
};

export const afterResponseHook = async (request: Request, _options: any, response: Response) => {
  logRequest(request, response);

  if (!response.ok) {
    await handleErrorResponse(request, response);
  }

  return response;
};
