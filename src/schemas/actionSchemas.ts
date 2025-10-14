import { z } from "zod";

// API Function Schema - for creating reusable API functions
export const apiFunctionSchema = z.object({
  name: z.string().min(1, "Function name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  url: z.string().url("Invalid URL format"),
  headers: z.record(z.string()).optional(),
  queryParams: z.record(z.string()).optional(),
  requestBody: z.string().optional(),
  
  // Authentication
  authType: z.enum(["none", "bearer", "basic", "api_key", "oauth"]),
  bearerToken: z.string().optional(),
  basicUsername: z.string().optional(),
  basicPassword: z.string().optional(),
  apiKey: z.string().optional(),
  apiKeyHeader: z.string().optional(),
  
  // Response handling
  responseMapping: z.record(z.string()).optional(),
  errorHandling: z.object({
    retries: z.number().min(0).max(5).default(0),
    timeout: z.number().min(1000).max(30000).default(5000),
    fallbackMessage: z.string().optional(),
  }).optional(),
});

// Sequential Workflow Schema - for automation workflows
export const sequentialWorkflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  
  // Trigger configuration
  trigger: z.object({
    type: z.enum(["keyword", "intent", "sentiment", "condition", "manual", "schedule"]),
    value: z.string().min(1, "Trigger value is required"),
    conditions: z.record(z.any()).optional(),
  }),
  
  // Sequential steps
  steps: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Step name is required"),
    type: z.enum(["api_call", "webhook", "condition", "message", "delay", "email", "crm_update", "calendar_booking", "notification"]),
    
    // API Call Configuration
    apiFunction: z.string().optional(), // Reference to created API function
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).optional(),
    url: z.string().optional(),
    headers: z.record(z.string()).optional(),
    requestBody: z.string().optional(),
    
    // Authentication (if not using API function)
    authType: z.enum(["none", "bearer", "basic", "api_key"]).optional(),
    bearerToken: z.string().optional(),
    apiKey: z.string().optional(),
    apiKeyHeader: z.string().optional(),
    
    // Condition Configuration
    conditionField: z.string().optional(),
    conditionOperator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"]).optional(),
    conditionValue: z.string().optional(),
    
    // Message Configuration
    messageText: z.string().optional(),
    
    // Email Configuration
    emailTo: z.string().optional(),
    emailSubject: z.string().optional(),
    emailBody: z.string().optional(),
    
    // CRM Integration
    crmProvider: z.enum(["salesforce", "hubspot", "pipedrive", "custom"]).optional(),
    crmAction: z.enum(["create_contact", "update_contact", "create_deal", "update_deal", "add_note"]).optional(),
    crmData: z.record(z.any()).optional(),
    
    // Calendar Integration
    calendarProvider: z.enum(["google", "outlook", "calendly", "custom"]).optional(),
    calendarAction: z.enum(["book_meeting", "cancel_meeting", "reschedule_meeting", "check_availability"]).optional(),
    calendarData: z.record(z.any()).optional(),
    
    // Delay Configuration
    delaySeconds: z.number().min(1).max(3600).optional(),
    
    // Next step logic
    onSuccess: z.string().optional(), // Next step ID on success
    onFailure: z.string().optional(), // Next step ID on failure
  })).min(1, "At least one step is required"),
});

// Legacy API request schema for backward compatibility
export const apiRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  url: z.string().url("Invalid URL format"),
  headers: z.record(z.string()).optional(),
  body: z.record(z.any()).optional(),
  auth: z.object({
    type: z.enum(["bearer", "basic", "api_key"]),
    token: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    apiKey: z.string().optional(),
    apiKeyHeader: z.string().optional(),
  }).optional(),
});

export const webhookConfigSchema = z.object({
  url: z.string().url("Invalid webhook URL"),
  method: z.enum(["POST", "PUT"]),
  headers: z.record(z.string()).optional(),
  retries: z.number().min(0).max(5).optional(),
  timeout: z.number().min(1000).max(30000).optional(),
});

export const actionTriggerSchema = z.object({
  type: z.enum(["keyword", "intent", "sentiment", "condition", "manual"]),
  value: z.string().min(1, "Trigger value is required"),
  conditions: z.record(z.any()).optional(),
});

export const actionStepSchema = z.object({
  id: z.string(),
  type: z.enum(["message", "api_call", "webhook", "condition", "delay", "escalate", "log"]),
  config: z.record(z.any()),
  apiRequest: apiRequestSchema.optional(),
  webhookConfig: webhookConfigSchema.optional(),
  nextStep: z.string().optional(),
});

// Legacy workflow step schema
export const workflowStepSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Step name is required"),
  type: z.enum(["api_call", "webhook", "condition", "message", "delay", "email"]),
  
  // API Configuration
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).optional(),
  url: z.string().optional(),
  headers: z.record(z.string()).optional(),
  queryParams: z.record(z.string()).optional(),
  body: z.string().optional(),
  
  // Authentication
  authType: z.enum(["none", "bearer", "basic", "api_key", "oauth"]).optional(),
  bearerToken: z.string().optional(),
  basicUsername: z.string().optional(),
  basicPassword: z.string().optional(),
  apiKey: z.string().optional(),
  apiKeyHeader: z.string().optional(),
  
  // Webhook Configuration
  webhookUrl: z.string().optional(),
  webhookMethod: z.enum(["POST", "PUT"]).optional(),
  webhookHeaders: z.record(z.string()).optional(),
  
  // Condition Configuration
  conditionField: z.string().optional(),
  conditionOperator: z.enum(["equals", "not_equals", "contains", "greater_than", "less_than"]).optional(),
  conditionValue: z.string().optional(),
  
  // Message Configuration
  messageText: z.string().optional(),
  messageTemplate: z.string().optional(),
  
  // Email Configuration
  emailTo: z.string().optional(),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  
  // Delay Configuration
  delaySeconds: z.number().min(1).max(3600).optional(),
});

// Legacy workflow schema
export const workflowSchema = z.object({
  name: z.string().min(1, "Workflow name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  trigger: actionTriggerSchema,
  steps: z.array(workflowStepSchema).min(1, "At least one step is required"),
});

export const customActionSchema = z.object({
  name: z.string().min(1, "Action name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required").max(500, "Description too long"),
  type: z.enum(["conversation", "followup", "task", "knowledge", "booking", "order", "alert", "workflow", "api", "messaging", "business", "learning"]),
  triggers: z.array(actionTriggerSchema).min(1, "At least one trigger is required"),
  steps: z.array(actionStepSchema).min(1, "At least one step is required"),
});

export type ApiFunctionFormData = z.infer<typeof apiFunctionSchema>;
export type SequentialWorkflowFormData = z.infer<typeof sequentialWorkflowSchema>;
export type CustomActionFormData = z.infer<typeof customActionSchema>;

// Legacy types for backward compatibility
export type WorkflowFormData = z.infer<typeof workflowSchema>;
export type WorkflowStepFormData = z.infer<typeof workflowStepSchema>;
export type ApiRequestFormData = z.infer<typeof apiRequestSchema>;
export type WebhookConfigFormData = z.infer<typeof webhookConfigSchema>;