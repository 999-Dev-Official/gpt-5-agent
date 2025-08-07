import { Agent } from "@voltagent/core";
import { createSendMessageToChannelTool } from "./sendMessageToChannel";
import { agentChat } from "@/config";

export const loadTools = (agent: Agent<any>) => {
  agent.addItems([createSendMessageToChannelTool(agentChat)]);
};
