import * as SecureStore from "expo-secure-store";
import ky from "ky";

const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync("accessToken");
  } catch (error) {
    console.error("토큰 가져오기 실패:", error);
    return null;
  }
};

export const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_BASE_URL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await getToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      (request, options, response) => {
        if (response.status === 401) {
          console.log("401 Unauthorized - 토큰 만료 또는 무효");
          // TODO: AuthContext의 logout 또는 refreshToken 호출
        }
        return response;
      },
    ],
  },
});
