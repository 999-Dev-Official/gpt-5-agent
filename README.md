### GPT‑5 Agent (Node/TypeScript)

General-purpose workspace assistant powered by OpenAI `gpt-5`, built with Express and VoltAgent. It receives batched channel events via a simple HTTP endpoint and replies back to the channel using the `agent-chat` service through a dedicated tool.

### Features
- **Event-driven**: HTTP endpoint `POST /v1/events` for incoming channel events
- **Tool-gated messaging**: Always replies via the `sendMessageToChannel` tool
- **Clean agent setup**: VoltAgent + Vercel AI provider targeting `openai("gpt-5")`
- **Typed payloads**: Request schemas encoded in TypeScript

### Prerequisites
- Node.js 18+
- pnpm
- Required environment variables:
  - `OPENAI_API_KEY`: OpenAI API key for the `openai("gpt-5")` model
  - `AGENT_API_KEY`: API key for the `agent-chat` service
  - `PORT` (optional, default `7102`)
  - `SLACK_VERIFICATION_TOKEN` (optional; only needed if you enable request verification middleware)

Create a `.env` file in `gpt-5/`:

```bash
OPENAI_API_KEY=sk-...
AGENT_API_KEY=...
PORT=7102
SLACK_VERIFICATION_TOKEN=optional-token
```

### Install and run

```bash
pnpm i
pnpm dev      # runs src/index.ts with ts-node

# or build and run
pnpm build
pnpm start
```

Server listens on `/:port` (default `7102`).

### HTTP API

- **POST** `/v1/events`
  - Returns `200 OK` immediately; processing continues asynchronously.
  - Body (TypeScript type `IPostEventsRouteBody`):

```ts
type IPostEventsRouteBody = {
  event: "channel.messages.batch";
  workspaceId: string;
  channelId: string;
  messages: Array<{
    id: string;
    content: string;
    sender_id: string;
    status: "sent";
    timestamp: number;
    type: string;
  }>;
  timestamp: number;
  context: {
    relevantWorkspaceContext: {
      memories: Array<{
        chunks: Array<{ content: string; isRelevant: boolean; score: number }>;
        summary: string;
      }>;
      time: number;
      total: number;
    } | null;
  };
};
```

Example request:

```bash
curl -X POST http://localhost:7102/v1/events \
  -H 'Content-Type: application/json' \
  -d '{
    "event": "channel.messages.batch",
    "workspaceId": "ws_123",
    "channelId": "ch_456",
    "messages": [
      {"id": "m1", "content": "@gpt5 Summarize this thread", "sender_id": "u1", "status": "sent", "timestamp": 1736111111, "type": "text"}
    ],
    "timestamp": 1736111112,
    "context": {"relevantWorkspaceContext": null}
  }'
```

### Agent behavior

- Defined in `src/agents/gpt5/gpt5Agent.ts` with:
  - `name`: `gpt5`
  - `model`: `openai("gpt-5")`
  - Instructions emphasize that the agent must reply via the `sendMessageToChannel` tool.
- On incoming events, the controller:
  - Loads tools via `loadTools`
  - Invokes `agent.generateText(JSON.stringify(req.body), { conversationId: channelId, userId: workspaceId })`
  - The agent must call the `sendMessageToChannel` tool to send the actual response back to the channel.

### Tools

- `sendMessageToChannel` (`src/agents/gpt5/tools/sendMessageToChannel`)
  - Parameters: `{ channelId: string; message: string }`
  - Sends a message via `agent-chat` using `agentChat.channel.message.send({ channelId, content })`
  - Requires `AGENT_API_KEY` to be set

### Optional: Request verification

A simple middleware exists at `src/routes/events/middlewares/verifyRequest` to check `req.body.token === process.env.SLACK_VERIFICATION_TOKEN`.

To enable it, update the events router:

```ts
// src/routes/events/index.ts
import { Router } from "express";
import { postEventsController } from "@/controllers/events";
import { verifyRequest } from "./middlewares";

const router = Router();
router.post("/", verifyRequest, postEventsController);
export default router;
```

### Project structure (key files)

```
src/
  index.ts                          # Express server, mounts /v1/events
  agents/
    agents.ts                       # Agent registry
    gpt5/
      gpt5Agent.ts                  # GPT-5 agent definition
      constants.ts                  # Name, description, instructions
      tools/
        loadTools.ts                # Registers tools for the agent
        sendMessageToChannel/       # Tool to send channel messages via agent-chat
  controllers/
    events/post/postEventsController.ts
  routes/
    events/index.ts                 # POST /v1/events
    events/middlewares/verifyRequest
  config/
    index.ts                        # env, alias registration, exports agentChat
    agentChat/agentChat.ts          # AgentChat client (needs AGENT_API_KEY)
```

### License

ISC (see `package.json`).

