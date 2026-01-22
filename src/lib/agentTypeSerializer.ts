import { AgentType } from "@/types/agent";

// DB enum values: 0 = text, 1 = voice, 2 = multimodal (vision)
export const AgentTypeEnum = {
  MULTIMODAL: 0,
  TEXT: 1,
  VOICE: 2,
} as const;

export const agentTypeToEnum = (type: AgentType): number => {
  switch (type) {
    case AgentType.TEXT:
      return AgentTypeEnum.TEXT;
    case AgentType.VOICE:
      return AgentTypeEnum.VOICE;
    case AgentType.MULTIMODAL:
      return AgentTypeEnum.MULTIMODAL;
    default:
      return AgentTypeEnum.TEXT;
  }
};

export const enumToAgentType = (enumValue: number): AgentType => {
  switch (enumValue) {
    case AgentTypeEnum.TEXT:
      return AgentType.TEXT;
    case AgentTypeEnum.VOICE:
      return AgentType.VOICE;
    case AgentTypeEnum.MULTIMODAL:
      return AgentType.MULTIMODAL;
    default:
      return AgentType.TEXT;
  }
};
