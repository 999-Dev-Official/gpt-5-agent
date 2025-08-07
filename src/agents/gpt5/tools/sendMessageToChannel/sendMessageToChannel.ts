import { createTool } from "@voltagent/core";
import { AgentChat } from "agent-chat";
import { z } from "zod";

export const createSendMessageToChannelTool = (agentChat: AgentChat) =>
  createTool({
    name: "sendMessageToChannel",
    description: "Send a message to a specific Slack channel",
    parameters: z.object({
      channelId: z
        .string()
        .describe("The Slack channel ID to send the message to"),
      message: z.string().describe("The message to send to the channel"),
    }),
    execute: async ({ channelId, message }) => {
      console.log("Calling tool sendMessageToChannel");
      try {
        const result = await agentChat.channel.message.send({
          channelId,
          content: message,
        });

        return { success: true, result };
      } catch (error) {
        // console.error("Error sending message to channel:", error);
        return { success: false, error: "Failed to send message to channel" };
      }
    },
  });
