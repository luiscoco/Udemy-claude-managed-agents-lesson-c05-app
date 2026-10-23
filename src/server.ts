import { serveStudentAsset } from "./student-assets";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { createRestricted, restrictedConfig } from "./policy";
if (existsSync(".env")) process.loadEnvFile(".env");
const port = Number(process.env.PORT || 3005);
const key = process.env.ANTHROPIC_API_KEY || "";
const configured = Boolean(key && !key.startsWith("your_"));
http.createServer(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (await serveStudentAsset(req, res)) return;
    if (req.method === "GET" && req.url === "/api/config") { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify({ configured, policy: restrictedConfig })); return; }
    if (req.method === "POST" && req.url === "/api/environment") {
      const origin = req.headers.origin;
      if (origin && origin !== `http://127.0.0.1:${port}` && origin !== `http://localhost:${port}`) { res.writeHead(403).end(); return; }
      if (!configured) throw new Error("Configure ANTHROPIC_API_KEY in .env.");
      const client = new Anthropic({ apiKey: key });
      const created = await createRestricted(client);
      try {
        const retrieved = await client.beta.environments.retrieve(created.id);
        res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify({ createdId: created.id, environment: retrieved }));
      } catch (error) { res.writeHead(502, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: `Created environment ${created.id}, but retrieval failed: ${error instanceof Error ? error.message : "unknown error"}. Save the ID before retrying.` })); }
      return;
    }
    const files: Record<string, string> = { "/": "index.html", "/style.css": "style.css", "/app.js": "app.js", "/astronaut.png": "astronaut.png" };
    if (req.method === "GET" && req.url && files[req.url]) { const file=files[req.url]; const data=await readFile(path.join(__dirname, "..", "public", file)); res.writeHead(200, { "Content-Type": file.endsWith(".png") ? "image/png" : file.endsWith(".css") ? "text/css" : file.endsWith(".js") ? "text/javascript" : "text/html; charset=utf-8" }); res.end(data); return; }
    res.writeHead(404).end("Not found");
  } catch (error) { res.writeHead(500, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: error instanceof Error ? error.message : "Request failed" })); }
}).listen(port, "127.0.0.1", () => console.log(`Open http://127.0.0.1:${port}`));
