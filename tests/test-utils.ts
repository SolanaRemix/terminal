/**
 * Test utilities and helpers
 */

export function createMockContext(overrides = {}) {
  return {
    body: "/terminal help",
    repo: "SolanaRemix/terminal",
    issueNumber: 1,
    ...overrides
  };
}

export function createMockOctokit() {
  return {
    request: jest.fn().mockResolvedValue({ data: {} })
  };
}

export function waitFor(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class MockResponse {
  statusCode: number = 200;
  private body: string = "";

  end(data: string) {
    this.body = data;
  }

  getBody() {
    return this.body;
  }
}
