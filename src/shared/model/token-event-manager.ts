type TokenExpiredCallback = () => void;
type TokenRefreshedCallback = (tokens: { accessToken: string; refreshToken: string }) => void;

class TokenEventManager {
  private expiredCallbacks: TokenExpiredCallback[] = [];
  private refreshedCallbacks: TokenRefreshedCallback[] = [];

  onTokenExpired(callback: TokenExpiredCallback) {
    this.expiredCallbacks.push(callback);
    return () => {
      this.expiredCallbacks = this.expiredCallbacks.filter((cb) => cb !== callback);
    };
  }

  emitTokenExpired() {
    this.expiredCallbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error('Token expired callback error:', error);
      }
    });
  }

  onTokenRefreshed(callback: TokenRefreshedCallback) {
    this.refreshedCallbacks.push(callback);
    return () => {
      this.refreshedCallbacks = this.refreshedCallbacks.filter((cb) => cb !== callback);
    };
  }

  emitTokenRefreshed(tokens: { accessToken: string; refreshToken: string }) {
    this.refreshedCallbacks.forEach((callback) => {
      try {
        callback(tokens);
      } catch (error) {
        console.error('Token refreshed callback error:', error);
      }
    });
  }
}

export const tokenEventManager = new TokenEventManager();
