import { AgentType } from "@/types/agent";

// DB enum values: 0 = text, 1 = voice, 2 = multimodal (vision)
export const AgentTypeEnum = {
  TEXT: 0,
  VOICE: 1,
  MULTIMODAL: 2,
} as const;

export const agentTypeToEnum = (type: AgentType): number => {
  switch (type) {
    case AgentType.TEXT:
      return AgentTypeEnum.TEXT;
    case AgentType.VOICE:
      return AgentTypeEnum.VOICE;
    case AgentType.VISION:
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
      return AgentType.VISION;
    default:
      return AgentType.TEXT;
  }
};
