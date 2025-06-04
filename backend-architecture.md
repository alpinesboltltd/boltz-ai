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

### Infrastructure
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **AWS**: Cloud infrastructure
- **Terraform**: Infrastructure as code
- **GitHub Actions**: CI/CD pipeline

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

### 5. Conversation Service
- **Language**: Golang
- **Responsibilities**:
  - Message handling
  - Context management
  - Human handoff
  - Message queueing
  - Real-time communication (WebSockets)

### 6. AI Service
- **Language**: TypeScript (Node.js)
- **Responsibilities**:
  - AI model integration (Gemini, GPT-4, Claude, Mistral)
  - Model selection & configuration
  - Prompt engineering
  - Response generation
  - Model performance monitoring

### 7. Knowledge Service
- **Language**: Golang
- **Responsibilities**:
  - Document processing & indexing
  - Knowledge base management
  - Vector database integration
  - Semantic search
  - Training data management

### 8. Integration Service
- **Language**: TypeScript (Node.js)
- **Responsibilities**:
  - Third-party platform integrations
  - Webhook management
  - API key management
  - Integration configuration

### 9. Analytics Service
- **Language**: Golang
- **Responsibilities**:
  - Data collection
  - Metrics calculation
  - Report generation
  - Event tracking
  - Data visualization preparation

### 10. Notification Service
- **Language**: TypeScript (Node.js)
- **Responsibilities**:
  - Email notifications
  - In-app notifications
  - Alerts & monitoring
  - Scheduled notifications

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
      fontFamily: string,
      chatIcon: string,
      welcomeMessage: string
    },
    behavior: {
      initialMessages: [string],
      fallbackMessage: string,
      enableHumanHandoff: boolean,
      offlineMessage: string
    },
    integrations: {
      platforms: [string],
      apiKeys: {
        platform: string
      }
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
  metadata: {
    aiModel: string,
    confidence: number,
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
    conversionsCount: number
  },
  hourlyBreakdown: [
    {
      hour: number,
      messages: number,
      users: number
    }
  ]
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

### Knowledge API
- `GET /api/chatbots/:id/knowledge` - List knowledge bases
- `POST /api/chatbots/:id/knowledge` - Create knowledge base
- `GET /api/knowledge/:id` - Get knowledge base details
- `PUT /api/knowledge/:id` - Update knowledge base
- `DELETE /api/knowledge/:id` - Delete knowledge base
- `POST /api/knowledge/:id/sources` - Add knowledge source
- `DELETE /api/knowledge/:id/sources/:sourceId` - Remove knowledge source
- `POST /api/knowledge/:id/train` - Train knowledge base

### Conversation API
- `POST /api/conversation/:chatbotId` - Start a new conversation
- `POST /api/conversation/:chatbotId/message` - Send a message
- `GET /api/conversation/:id/history` - Get conversation history
- `POST /api/conversation/:id/feedback` - Submit conversation feedback
- `POST /api/conversation/:id/handoff` - Request human handoff

### Analytics API
- `GET /api/analytics/chatbots/:id` - Get chatbot analytics
- `GET /api/analytics/chatbots/:id/conversations` - Get conversation analytics
- `GET /api/analytics/chatbots/:id/users` - Get user analytics
- `GET /api/analytics/chatbots/:id/questions` - Get top questions
- `GET /api/analytics/chatbots/:id/feedback` - Get feedback analytics
- `GET /api/analytics/chatbots/:id/export` - Export analytics data

### Integration API
- `GET /api/integrations` - List available integrations
- `GET /api/chatbots/:id/integrations` - List chatbot integrations
- `POST /api/chatbots/:id/integrations/:platform` - Add integration
- `DELETE /api/chatbots/:id/integrations/:platform` - Remove integration
- `GET /api/chatbots/:id/integrations/:platform/config` - Get integration config
- `PUT /api/chatbots/:id/integrations/:platform/config` - Update integration config

## Security Considerations

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- API key authentication for integrations
- OAuth 2.0 for third-party integrations

### Data Protection
- End-to-end encryption for sensitive data
- Data encryption at rest
- HTTPS for all API endpoints
- Regular security audits

### Compliance
- GDPR compliance
- HIPAA compliance (for healthcare clients)
- SOC 2 compliance
- Data retention policies

## Scalability Considerations

### Horizontal Scaling
- Stateless services for easy scaling
- Load balancing across service instances
- Database sharding for high-volume data

### Performance Optimization
- Caching frequently accessed data
- Asynchronous processing for non-critical operations
- Database query optimization
- CDN for static assets

### High Availability
- Multi-region deployment
- Automated failover
- Regular backups
- Disaster recovery planning

## Monitoring & Observability

### Logging
- Centralized logging system
- Structured log format
- Log retention policies
- Log analysis tools

### Metrics
- Service-level metrics
- Business metrics
- System metrics
- Custom metrics for key processes

### Alerting
- Automated alerts for critical issues
- On-call rotation
- Incident response procedures
- Post-mortem analysis

## Development Workflow

### Version Control
- Git-based workflow
- Feature branches
- Pull request reviews
- Semantic versioning

### CI/CD Pipeline
- Automated testing
- Static code analysis
- Security scanning
- Automated deployment
- Canary releases

### Documentation
- API documentation with OpenAPI/Swagger
- Service documentation
- Architecture diagrams
- Runbooks for common operations

## Future Considerations

### AI Model Improvements
- Fine-tuning capabilities
- Custom model training
- Model performance benchmarking
- A/B testing different models

### Advanced Analytics
- Predictive analytics
- Sentiment analysis
- Conversation flow optimization
- User behavior analysis

### Enhanced Integrations
- More third-party platforms
- Deeper integration capabilities
- Custom integration development
- Integration marketplace