import '@testing-library/jest-dom/vitest';

// Mock window.matchMedia if needed in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock window.scrollTo
window.scrollTo = () => {};

// Mock Groq API calls in test environment so tests are 100% deterministic, instant, and do not hit TPM rate limits
const originalFetch = globalThis.fetch;
globalThis.fetch = (async (input: any, init?: any) => {
  const urlStr = typeof input === 'string' ? input : input?.url || '';
  if (urlStr.includes('api.groq.com')) {
    // Return graceful 503 so aiService seamlessly activates the deterministic studio simulation engine
    return {
      ok: false,
      status: 503,
      json: async () => ({ error: 'simulated_test_offline' }),
    } as any;
  }
  return originalFetch(input, init);
}) as typeof fetch;
