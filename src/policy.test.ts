import { test } from "node:test";
import assert from "node:assert/strict";
import Anthropic from "@anthropic-ai/sdk";
import { createRestricted, restrictedConfig } from "./policy";
test("creates a limited environment with explicit empty exceptions", async () => {
  let received: any;
  const client = { beta: { environments: { create: async (args: any) => { received = args; return { id: "env_demo" }; } } } } as unknown as Anthropic;
  const result = await createRestricted(client);
  assert.equal(result.id, "env_demo");
  assert.deepEqual(received.config, restrictedConfig);
});
