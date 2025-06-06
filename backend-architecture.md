# Boltz.co Backend Architecture

## Overview

The backend architecture for Boltz.co is designed to be scalable, maintainable, and performant. It follows a microservices approach with Golang for core services and TypeScript for API layers.

## Technology Stack

### Languages & Frameworks
- **Golang**: For core services requiring high performance
- **TypeScript**: For API layers and services requiring rapid development
- **gRPC**: For internal service communication
- **REST API**: For external client communication

### Data Storage
- **PostgreSQL**: Primary relational database
- **Redis**: Caching and session management
- **MongoDB**: For storing conversation history and analytics data
- **Elasticsearch**: For search functionality across knowledge bases
- **AWS S3**: For file storage (documents, images, etc.)
- **Pinecone/Weaviate**: Vector database for embeddings storage

### Infrastructure
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **AWS**: Cloud infrastructure
- **Terraform**: Infrastructure as code
- **GitHub Actions**: CI/CD pipeline

## Feature & Integration Table

| Feature | Description | Integrated Platforms |
|---------|-------------|----------------------|
| Custom AI Selection | Users can choose from multiple AI models, including Gemini, GPT-4, Claude, and Mistral | Gemini, OpenAI GPT-4, Claude, Mistral |
| AI-Powered Knowledge Retrieval | Retrieves company knowledge from uploaded documents, FAQs, and databases | Slack, MS Teams, Discord, Google Drive, Dropbox |
| Advanced NLP & Machine Learning | AI learns from conversations and improves over time | Rasa Core, TensorFlow, Hugging Face, OpenAI API |
| Real-Time Chatbot Training | Users can train and update their bot dynamically | Chatbase Web Platform, OpenAI Playground, Google Gemini Sandbox |
| Multilingual Support | Supports 80+ languages for global accessibility | Google Translate API, Microsoft Translator, AWS Polly |
| No-Code Chatbot Builder | Drag-and-drop interface for building AI assistants without technical expertise | Web Platform, Shopify, WordPress, Wix, Webflow |
| Deep Analytics & User Insights | Provides chatbot performance data, user interactions, and conversion tracking | Google Analytics, HubSpot, Tableau, Mixpanel |
| Omnichannel Integrations | Deploy chatbots on websites, WhatsApp, Slack, and social media | WhatsApp Business, Facebook Messenger, Telegram, Instagram, Twitter DMs |
| Live Human Handoff | Routes conversations to human agents when AI assistance isn't enough | Intercom, Zendesk, Freshdesk, Salesforce |
| Secure Transactions & Privacy Controls | Offers encrypted messaging and compliance with GDPR & HIPAA | AWS Cloud Security, Google Cloud Encryption, Microsoft Azure |
| Customizable Pricing Plans | Offers flexible plans similar to Chatbase, including free, Pro, and Enterprise tiers | Stripe, PayPal, Razorpay, Coinbase Commerce |
| Voice Capabilities | Support for voice input and output in conversations | Amazon Polly, Google Text-to-Speech, Microsoft Azure Speech Services |
| Custom Avatar & Branding | Personalized chatbot appearance with custom avatars and brand colors | Web Platform, Custom CSS, Image Processing API |
| Conversation Interface Customization | Fully customizable chat interface with themes and layouts | Web Components, React, Vue.js |
| Enterprise SSO | Single sign-on for enterprise customers | Okta, Auth0, Microsoft Azure AD, Google Workspace |
| API Access | RESTful API for custom integrations and extensions | Swagger/OpenAPI, GraphQL |

## Microservices Architecture

### 1. API Gateway Service
- **Language**: TypeScript (Node.js)
- **Responsibilities**:
  - Request routing
  - Authentication & authorization
  - Rate limiting
  - Request/response transformation
  - API documentation (Swagger/OpenAPI)

### 2. Authentication Service
- **Language**: Golang
- **Responsibilities**:
  - User registration & login
  - OAuth integration
  - JWT token management
  - Role-based access control
  - Password management
  - Enterprise SSO integration

### 3. User Service
- **Language**: Golang
- **Responsibilities**:
  - User profile management
  - Team management
  - Subscription & billing integration
  - User preferences

### 4. Chatbot Service
- **Language**: Golang
- **Responsibilities**:
  - Chatbot configuration management
  - Chatbot deployment
  - Conversation flow management
  - Chatbot settings & customization
  - Avatar & branding management
  - Interface customization

### 5. Conversation Service
- **Language**: Golang
- **Responsibilities**:
  - Message handling
  - Context management
  - Human handoff
  - Message queueing
  - Real-time communication (WebSockets)
  - Voice processing & transcription

### 6. AI Service
- **Language**: TypeScript (Node.js)
- **Responsibilities**:
  - AI model integration (Gemini, GPT-4, Claude, Mistral)
  - Model selection & configuration
  - Prompt engineering
  - Response generation
  - Model performance monitoring
  - Multilingual processing

### 7. Knowledge Service
- **Language**: Golang
- **Responsibilities**:
  - Document processing & indexing
  - Knowledge base management
  - Vector database integration
  - Semantic search
  - Training data management
  - Real-time training updates

### 8. Integration Service
- **Language**: TypeScript (Node.js)
- **Responsibilities**:
  - Third-party platform integrations
  - Webhook management
  - API key management
  - Integration configuration
  - Omnichannel deployment

### 9. Analytics Service
- **Language**: Golang
- **Responsibilities**:
  - Data collection
  - Metrics calculation
  - Report generation
  - Event tracking
  - Data visualization preparation
  - User insights & conversion tracking

### 10. Notification Service
- **Language**: TypeScript (Node.js)
- **Responsibilities**:
  - Email notifications
  - In-app notifications
  - Alerts & monitoring
  - Scheduled notifications

### 11. Voice Processing Service
- **Language**: TypeScript (Node.js)
- **Responsibilities**:
  - Speech-to-text conversion
  - Text-to-speech generation
  - Voice recognition
  - Voice synthesis
  - Audio processing

### 12. Payment & Billing Service
- **Language**: Golang
- **Responsibilities**:
  - Subscription management
  - Payment processing
  - Invoice generation
  - Usage tracking
  - Plan management

## Database Schema

### Users Collection
```
{
  id: string,
  email: string,
  passwordHash: string,
  name: string,
  company: string,
  plan: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLoginAt: timestamp,
  settings: {
    notifications: boolean,
    theme: string,
    ...
  }
}
```

### Teams Collection
```
{
  id: string,
  name: string,
  ownerId: string,
  members: [
    {
      userId: string,
      role: string,
      joinedAt: timestamp
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Chatbots Collection
```
{
  id: string,
  userId: string,
  teamId: string,
  name: string,
  description: string,
  aiModel: string,
  status: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  settings: {
    appearance: {
      primaryColor: string,
      secondaryColor: string,
      fontFamily: string,
      chatIcon: string,
      avatarType: string,
      avatarImage: string,
      welcomeMessage: string,
      darkMode: boolean,
      position: string
    },
    behavior: {
      initialMessages: [string],
      fallbackMessage: string,
      enableHumanHandoff: boolean,
      offlineMessage: string,
      voiceEnabled: boolean,
      voiceSettings: {
        voice: string,
        speed: number,
        pitch: number
      }
    },
    integrations: {
      platforms: [string],
      apiKeys: {
        platform: string
      }
    },
    security: {
      dataRetention: number,
      piiFiltering: boolean,
      endToEndEncryption: boolean,
      ipWhitelist: [string],
      sensitiveTopics: [string],
      gdprCompliant: boolean,
      hipaaCompliant: boolean
    }
  }
}
```

### KnowledgeBases Collection
```
{
  id: string,
  chatbotId: string,
  name: string,
  description: string,
  createdAt: timestamp,
  updatedAt: timestamp,
  lastTrainedAt: timestamp,
  status: string
}
```

### KnowledgeSources Collection
```
{
  id: string,
  knowledgeBaseId: string,
  type: string,
  name: string,
  content: string,
  url: string,
  fileUrl: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Conversations Collection
```
{
  id: string,
  chatbotId: string,
  sessionId: string,
  startedAt: timestamp,
  endedAt: timestamp,
  userIdentifier: string,
  platform: string,
  metadata: {
    userAgent: string,
    ipAddress: string,
    referrer: string,
    language: string,
    ...
  }
}
```

### Messages Collection
```
{
  id: string,
  conversationId: string,
  content: string,
  role: string,
  timestamp: timestamp,
  audioUrl: string,
  hasVoice: boolean,
  metadata: {
    aiModel: string,
    confidence: number,
    language: string,
    ...
  }
}
```

### Analytics Collection
```
{
  id: string,
  chatbotId: string,
  date: date,
  metrics: {
    totalMessages: number,
    uniqueUsers: number,
    averageRating: number,
    responseRate: number,
    conversionsCount: number,
    voiceInteractions: number,
    humanHandoffs: number
  },
  hourlyBreakdown: [
    {
      hour: number,
      messages: number,
      users: number
    }
  ],
  platformBreakdown: [
    {
      platform: string,
      messages: number,
      users: number
    }
  ]
}
```

### Subscriptions Collection
```
{
  id: string,
  userId: string,
  plan: string,
  status: string,
  startDate: timestamp,
  endDate: timestamp,
  paymentMethod: string,
  paymentId: string,
  amount: number,
  currency: string,
  autoRenew: boolean,
  metadata: {
    provider: string,
    customerId: string,
    ...
  }
}
```

## API Endpoints

### Authentication API
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/sso/:provider` - Initiate SSO login
- `GET /api/auth/sso/:provider/callback` - SSO callback

### User API
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/me/subscription` - Get subscription details
- `PUT /api/users/me/subscription` - Update subscription
- `GET /api/users/me/teams` - Get user teams
- `POST /api/users/me/teams` - Create a new team

### Chatbot API
- `GET /api/chatbots` - List all chatbots
- `POST /api/chatbots` - Create a new chatbot
- `GET /api/chatbots/:id` - Get chatbot details
- `PUT /api/chatbots/:id` - Update chatbot
- `DELETE /api/chatbots/:id` - Delete chatbot
- `GET /api/chatbots/:id/stats` - Get chatbot statistics
- `POST /api/chatbots/:id/deploy` - Deploy chatbot
- `POST /api/chatbots/:id/undeploy` - Undeploy chatbot
- `PUT /api/chatbots/:id/appearance` - Update chatbot appearance
- `PUT /api/chatbots/:id/security` - Update security settings

### Knowledge API
- `GET /api/chatbots/:id/knowledge` - List knowledge bases
- `POST /api/chatbots/:id/knowledge` - Create knowledge base
- `GET /api/knowledge/:id` - Get knowledge base details
- `PUT /api/knowledge/:id` - Update knowledge base
- `DELETE /api/knowledge/:id` - Delete knowledge base
- `POST /api/knowledge/:id/sources` - Add knowledge source
- `DELETE /api/knowledge/:id/sources/:sourceId` - Remove knowledge source
- `POST /api/knowledge/:id/train` - Train knowledge base
- `POST /api/knowledge/:id/faqs` - Add FAQ
- `DELETE /api/knowledge/:id/faqs/:faqId` - Remove FAQ

### Conversation API
- `POST /api/conversation/:chatbotId` - Start a new conversation
- `POST /api/conversation/:chatbotId/message` - Send a message
- `GET /api/conversation/:id/history` - Get conversation history
- `POST /api/conversation/:id/feedback` - Submit conversation feedback
- `POST /api/conversation/:id/handoff` - Request human handoff
- `POST /api/conversation/:chatbotId/voice` - Send voice message
- `GET /api/conversation/:id/voice/:messageId` - Get voice message

### Analytics API
- `GET /api/analytics/chatbots/:id` - Get chatbot analytics
- `GET /api/analytics/chatbots/:id/conversations` - Get conversation analytics
- `GET /api/analytics/chatbots/:id/users` - Get user analytics
- `GET /api/analytics/chatbots/:id/questions` - Get top questions
- `GET /api/analytics/chatbots/:id/feedback` - Get feedback analytics
- `GET /api/analytics/chatbots/:id/export` - Export analytics data
- `GET /api/analytics/chatbots/:id/platforms` - Get platform distribution

### Integration API
- `GET /api/integrations` - List available integrations
- `GET /api/chatbots/:id/integrations` - List chatbot integrations
- `POST /api/chatbots/:id/integrations/:platform` - Add integration
- `DELETE /api/chatbots/:id/integrations/:platform` - Remove integration
- `GET /api/chatbots/:id/integrations/:platform/config` - Get integration config
- `PUT /api/chatbots/:id/integrations/:platform/config` - Update integration config

### Voice API
- `POST /api/voice/text-to-speech` - Convert text to speech
- `POST /api/voice/speech-to-text` - Convert speech to text
- `GET /api/voice/voices` - List available voices
- `POST /api/chatbots/:id/voice/settings` - Update voice settings

### Billing API
- `GET /api/billing/plans` - List available plans
- `POST /api/billing/subscribe` - Subscribe to a plan
- `PUT /api/billing/subscription/:id` - Update subscription
- `DELETE /api/billing/subscription/:id` - Cancel subscription
- `GET /api/billing/invoices` - List invoices
- `GET /api/billing/usage` - Get current usage

## Security Considerations

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- API key authentication for integrations
- OAuth 2.0 for third-party integrations
- Enterprise SSO (Okta, Auth0, Azure AD)

### Data Protection
- End-to-end encryption for sensitive data
- Data encryption at rest
- HTTPS for all API endpoints
- Regular security audits
- PII filtering and redaction

### Compliance
- GDPR compliance
- HIPAA compliance (for healthcare clients)
- SOC 2 compliance
- Data retention policies
- Data processing agreements

## Scalability Considerations

### Horizontal Scaling
- Stateless services for easy scaling
- Load balancing across service instances
- Database sharding for high-volume data
- Auto-scaling based on traffic patterns

### Performance Optimization
- Caching strategies for frequently accessed data
- Asynchronous processing for non-critical operations
- CDN for static assets
- Database query optimization
- Efficient vector search algorithms