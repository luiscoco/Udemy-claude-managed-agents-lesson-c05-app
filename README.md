# C05 · Restricted Environment Networking

Creates a real restricted cloud environment and retrieves its configuration. Every click creates a resource; a failed retrieval is not proof creation failed. This app does not run network probes.

## Concepts students will learn

- Explicit limited networking
- Empty host allowlist and package-manager restrictions
- Create and retrieve environment configuration

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

Use your own Anthropic API key. This app creates an environment; an existing agent is not required.

No agent or environment provisioning is needed first. The application creates the environment when you press its Run button.

```powershell
npm start
```

Open `http://127.0.0.1:3005`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Open the lab, read the stated resource operation, and press the main Run button once. Inspect the returned IDs, configuration or events. Each live run can create a remote resource.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
PORT=3005
```

## How the app was build

### 1. Declare explicit limited networking

An empty allowed_hosts list and false package-manager/MCP exceptions make the intended networking policy visible. These network settings are separate from agent tool enablement.

Source: [src/policy.ts](src/policy.ts#L2)

```typescript
export const restrictedConfig = {
  type: "cloud",
  networking: {
    type: "limited",
    allowed_hosts: [],
    allow_package_managers: false,
    allow_mcp_servers: false,
  },
} as const;
```

### 2. Create the restricted environment

The SDK call sends the explicit cloud configuration and creates a real environment resource. Each invocation creates another resource; successful configuration creation does not prove that a sandbox command ran.

Source: [src/policy.ts](src/policy.ts#L3)

```typescript
export async function createRestricted(client: Anthropic) {
  return client.beta.environments.create({
    name: "Lesson C05 restricted environment",
    config: {
      type: "cloud",
      networking: {
        type: "limited",
        allowed_hosts: [],
        allow_package_managers: false,
        allow_mcp_servers: false,
      },
    },
  });
}
```

### 3. Retrieve the stored configuration after creation

The host retrieves the new resource using its returned ID rather than treating the input object as proof of stored state. If retrieval fails, preserve the creation ID before deciding whether to retry.

Source: [src/server.ts](src/server.ts#L22) · selected statements

```typescript
const created = await createRestricted(client);

// ... other source statements omitted ...
const retrieved = await client.beta.environments.retrieve(created.id);
```

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
