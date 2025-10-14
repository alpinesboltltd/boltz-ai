// Separate helper module to expose vector store without interfering with route handler type checks.
export const vectorStore: {
  [agentId: string]: {
    [sourceId: string]: { chunks: string[]; embeddings: number[][] };
  };
} = {};

export const getVectorStore = () => vectorStore;
