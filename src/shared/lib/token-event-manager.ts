type TokenExpiredCallback = () => void;

class TokenEventManager {
  private callbacks: TokenExpiredCallback[] = [];

  onTokenExpired(callback: TokenExpiredCallback) {
    this.callbacks.push(callback);

    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  emitTokenExpired() {
    this.callbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error('Token expired callback error:', error);
      }
    });
  }
}

export const tokenEventManager = new TokenEventManager();
