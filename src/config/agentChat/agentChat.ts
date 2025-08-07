import { AgentChat } from "agent-chat";

export const agentChat = new AgentChat({
  apiKey: process.env.AGENT_API_KEY || "",
});
