import { Agent } from "@voltagent/core";
import { openai } from "@ai-sdk/openai";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import {
  GPT5_AGENT_DESCRIPTION,
  GPT5_AGENT_INSTRUCTIONS,
  GPT5_AGENT_NAME,
} from "./constants";

export const gpt5Agent: Agent<any> = new Agent({
  name: GPT5_AGENT_NAME,
  description: GPT5_AGENT_DESCRIPTION,
  instructions: GPT5_AGENT_INSTRUCTIONS,
  llm: new VercelAIProvider(),
  model: openai("gpt-5"),
});
