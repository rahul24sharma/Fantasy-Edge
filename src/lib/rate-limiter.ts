// src/lib/rate-limiter.ts
export class RateLimiter {
    private requests: number[] = [];
    private readonly maxRequests: number;
    private readonly windowMs: number;
  
    constructor(maxRequests: number = 10, windowMs: number = 60000) {
      this.maxRequests = maxRequests;
      this.windowMs = windowMs;
    }
  
    canMakeRequest(): boolean {
      const now = Date.now();
      
      // Remove requests outside the current window
      this.requests = this.requests.filter(time => now - time < this.windowMs);
      
      if (this.requests.length >= this.maxRequests) {
        return false;
      }
      
      this.requests.push(now);
      return true;
    }
    
    getTimeUntilNextRequest(): number {
      if (this.requests.length < this.maxRequests) return 0;
      
      const oldestRequest = Math.min(...this.requests);
      return Math.max(0, this.windowMs - (Date.now() - oldestRequest));
    }
  }
  
  export const footballApiLimiter = new RateLimiter(10, 60000); // 10 requests per minute