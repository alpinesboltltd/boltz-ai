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
