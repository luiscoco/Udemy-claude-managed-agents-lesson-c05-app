import Anthropic from "@anthropic-ai/sdk";
export const restrictedConfig = { type: "cloud", networking: { type: "limited", allowed_hosts: [], allow_package_managers: false, allow_mcp_servers: false } } as const;
export async function createRestricted(client: Anthropic) {
  return client.beta.environments.create({ name: "Lesson C05 restricted environment", config: { type: "cloud", networking: { type: "limited", allowed_hosts: [], allow_package_managers: false, allow_mcp_servers: false } } });
}
