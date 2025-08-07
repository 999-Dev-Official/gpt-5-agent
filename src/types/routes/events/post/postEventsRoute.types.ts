export interface IChunk {
  content: string;
  isRelevant: boolean;
  score: number;
}

export interface ISearchMemoryData {
  memories: Array<{
    chunks: IChunk[];
    summary: string;
  }>;
  time: number;
  total: number;
}

export type BatchedMessage = {
  id: string;
  content: string;
  sender_id: string;
  status: "sent";
  timestamp: number;
  type: string;
};

export interface IPostEventsRouteBody {
  event: "channel.messages.batch";
  workspaceId: string;
  channelId: string;
  messages: BatchedMessage[];
  timestamp: number;
  context: {
    relevantWorkspaceContext: ISearchMemoryData | null;
  };
}
