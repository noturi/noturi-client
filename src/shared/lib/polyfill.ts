// polyfill.ts
if (typeof AbortSignal !== 'undefined' && !AbortSignal.prototype.throwIfAborted) {
  AbortSignal.prototype.throwIfAborted = function () {
    if (this.aborted) {
      throw this.reason;
    }
  };
}
