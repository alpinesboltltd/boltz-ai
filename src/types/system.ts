export interface SystemInstruction {
    id: string;
    title: string;
    content: string;
    user_id: string;
    template_id?: string;
    created_at: string;
    updated_at: string;
}

export interface PromptTemplate {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

import { z } from "zod";

export const CreatePromptTemplateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});

export type CreatePromptTemplateRequest = z.infer<typeof CreatePromptTemplateSchema>;
