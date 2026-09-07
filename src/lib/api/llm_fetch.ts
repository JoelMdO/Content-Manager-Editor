import { Agent } from "undici";

const llmDispatcher = new Agent({
  headersTimeout: 900_000,
  bodyTimeout: 900_000,
});

type LlmFetchInit = RequestInit & {
  dispatcher?: Agent;
};

export function fetchLlm(url: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...init,
    dispatcher: llmDispatcher,
  } as LlmFetchInit);
}
