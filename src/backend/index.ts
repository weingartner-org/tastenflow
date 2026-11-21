import type { Backend } from "./types";
import { MockBackend } from "./mock";

let instance: Backend | null = null;

export async function getBackend(): Promise<Backend> {
  if (instance) return instance;
  const mode = import.meta.env.VITE_BACKEND ?? "mock";
  if (mode === "pocketbase") {
    const { PocketBaseBackend } = await import("./pocketbase");
    instance = new PocketBaseBackend();
  } else {
    instance = new MockBackend();
  }
  await instance.init();
  return instance;
}

/** Test-only: drop the cached singleton so each test gets a fresh backend. */
export function _resetBackendForTests() {
  instance = null;
}

export * from "./types";
