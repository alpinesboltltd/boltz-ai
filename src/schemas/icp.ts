import { z } from "zod";

export const icpFirmographicsSchema = z.object({
  company_size: z
    .enum(["1-10", "11-50", "51-200", "201-1,000", "1,000+"])
    .optional(),
  annual_revenue: z.string().optional(),
  industry: z.array(z.string()).optional(),
  geography: z.array(z.string()).optional(),
  compliance_sensitivity: z.enum(["Low", "Medium", "High"]).optional(),
});

export const icpBuyerDecisionStructureSchema = z.object({
  primary_buyer_role: z.string().optional(),
  economic_buyer: z.boolean().optional(),
  approval_complexity: z.enum(["Simple", "Moderate", "Complex"]).optional(),
});

export const icpPainPointsTriggersSchema = z.object({
  pain_points: z.array(z.string()).optional(),
  trigger_events: z.array(z.string()).optional(),
  cost_of_inaction: z.string().optional(),
});

export const icpValuePrioritySchema = z.object({
  revenue_potential: z.enum(["Low", "Medium", "High"]).optional(),
  support_tier: z.enum(["Standard", "Priority", "White-glove"]).optional(),
  strategic_importance: z.string().optional(),
});

export const icpCommunicationSchema = z.object({
  preferred_channels: z.array(z.string()).optional(),
  tone_preference: z.enum(["Formal", "Neutral", "Casual"]).optional(),
  decision_style: z
    .enum(["Data-driven", "Relationship-driven", "Fast"])
    .optional(),
});

export const icpRiskEscalationSchema = z.object({
  max_autonomy: z.number().min(0).max(100).optional(),
  mandatory_escalation_topics: z.array(z.string()).optional(),
});

export const icpSchema = z.object({
  id: z.string().optional(),
  workspace_id: z.string().optional(),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  intended_agents: z.array(z.string()).optional(),

  firmographics: icpFirmographicsSchema.optional(),
  buyer_decision_structure: icpBuyerDecisionStructureSchema.optional(),
  pain_points_triggers: icpPainPointsTriggersSchema.optional(),
  value_priority: icpValuePrioritySchema.optional(),
  communication: icpCommunicationSchema.optional(),
  risk_escalation: icpRiskEscalationSchema.optional(),

  is_active: z.boolean().default(true).optional(),
});

export type ICP = z.infer<typeof icpSchema>;
