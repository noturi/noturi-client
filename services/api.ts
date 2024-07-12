import ky from "ky";

const API_BASE_URL = "http://localhost:3000";

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        // const token = getToken();
        // if (token) {
        //   request.headers.set('Authorization', `Bearer ${token}`);
        // }
      },
    ],
    afterResponse: [
      (request, options, response) => {
        if (response.status === 401) {
          // 로그아웃 처리
        }
        return response;
      },
    ],
  },
});
