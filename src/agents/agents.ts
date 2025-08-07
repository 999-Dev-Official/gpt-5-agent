import { VoltAgent } from "@voltagent/core";
import { gpt5Agent } from "./gpt5";

export const agentList = new VoltAgent({
  agents: {
    gpt5Agent,
  },
});
