import { Request, Response } from "express";
import { IPostEventsRouteBody } from "@/types/routes";
import { GPT5_AGENT_NAME } from "@/agents/gpt5/constants";
import { loadTools } from "@/agents/gpt5/tools";
import { agentList } from "@/agents";

export const postEventsController = async (
  req: Request<{}, {}, IPostEventsRouteBody>,
  res: Response
) => {
  res.status(200).send("OK");

  const gpt5Agent = agentList.getAgent(GPT5_AGENT_NAME);

  if (!gpt5Agent) {
    throw new Error("GPT5 agent not found");
  }

  loadTools(gpt5Agent);

  await gpt5Agent.generateText(JSON.stringify(req.body), {
    conversationId: req.body.channelId,
    userId: req.body.workspaceId,
  });
};
