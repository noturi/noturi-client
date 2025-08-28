import Logger from '../lib/logger';

export const logRequest = (request: Request, response: Response) => {
  Logger.info(`API ${request.method} ${request.url}`, {
    status: response.status,
    ok: response.ok,
  });
};

export const logErrorResponse = async (request: Request, response: Response) => {
  try {
    const responseText = await response.clone().text();
    Logger.warn('API Error Response', {
      method: request.method,
      url: request.url,
      status: response.status,
      responseBody: responseText,
    });
  } catch {
    Logger.warn('API Error - Could not read response body', {
      method: request.method,
      url: request.url,
      status: response.status,
    });
  }
};
