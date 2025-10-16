export interface FileSource {
  id: string;
  agent_id: string;
  name: string;
  size: number;
  type: "pdf" | "txt" | "doc" | "docx";
  status: "uploaded" | "processing" | "processed" | "failed";
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteSource {
  id: string;
  agent_id: string;
  url: string;
  title?: string;
  pages_crawled: number;
  status: "pending" | "crawling" | "crawled" | "failed";
  crawl_type: "single" | "sitemap" | "recursive";
  created_at: string;
  updated_at: string;
}

export interface TextSource {
  id: string;
  agent_id: string;
  title: string;
  content: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface QASource {
  id: string;
  agent_id: string;
  question: string;
  answer: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface AgentSources {
  files: FileSource[];
  websites: WebsiteSource[];
  texts: TextSource[];
  qaItems: QASource[];
  totalSize: number;
  maxSize: number;
}

export interface AddSourceRequest {
  type: "file" | "website" | "text" | "qa";
  data: {
    // For file
    file?: File;
    // For website
    url?: string;
    crawl_type?: "single" | "sitemap" | "recursive";
    // For text
    title?: string;
    content?: string;
    // For Q&A
    question?: string;
    answer?: string;
  };
}