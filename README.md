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

## How the application was developed

The browser collects inputs; the Node host validates requests; the lesson implementation produces observable evidence. The architecture page walks through the real source with numbered steps, prerequisite configuration, source filenames and code excerpts.

### Lesson implementation

[src/policy.ts](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c05-app/blob/main/src/policy.ts)

```typescript
import Anthropic from "@anthropic-ai/sdk";
export const restrictedConfig = { type: "cloud", networking: { type: "limited", allowed_hosts: [], allow_package_managers: false, allow_mcp_servers: false } } as const;
export async function createRestricted(client: Anthropic) {
  return client.beta.environments.create({ name: "Lesson C05 restricted environment", config: { type: "cloud", networking: { type: "limited", allowed_hosts: [], allow_package_managers: false, allow_mcp_servers: false } } });
}
```

Read the architecture page for the remaining source excerpts and explanations, including input handling and optional provider behavior. The diagram describes this application, rather than implying that an external integration has been implemented.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
