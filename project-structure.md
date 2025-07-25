# Chatboltz - AI Chatbot Platform Project Structure

## Overview

This document outlines the structure and components of the Chatboltz AI chatbot platform, modeled after Chatbase.co. The platform allows users to create custom AI chatbots powered by various AI models including Google Gemini, GPT-4, Claude, and Mistral.

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js v15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom components with Tailwind
- **Charts/Analytics**: Chart.js with React-Chartjs-2
- **Animations**: Framer Motion

### Directory Structure

```
Chatboltz/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   ├── chatbots/       # Chatbot management pages
│   │   │   ├── analytics/      # Analytics pages
│   │   │   ├── knowledge/      # Knowledge base pages
│   │   │   ├── integrations/   # Integration pages
│   │   │   └── settings/       # Settings pages
│   │   ├── chatbot/            # Public chatbot pages
│   │   │   └── [id]/           # Dynamic chatbot routes
│   │   ├── auth/               # Authentication pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home/landing page
│   ├── components/             # React components
│   │   ├── common/             # Common components
│   │   │   ├── Header.tsx      # Site header
│   │   │   ├── Footer.tsx      # Site footer
│   │   │   ├── Button.tsx      # Button component
│   │   │   └── Card.tsx        # Card component
│   │   ├── landing/            # Landing page components
│   │   │   ├── HeroSection.tsx # Hero section
│   │   │   ├── FeaturesSection.tsx # Features section
│   │   │   ├── PricingSection.tsx # Pricing section
│   │   │   ├── TestimonialsSection.tsx # Testimonials section
│   │   │   └── CTASection.tsx  # Call-to-action section
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── Sidebar.tsx     # Dashboard sidebar
│   │   │   ├── StatCard.tsx    # Statistics card
│   │   │   ├── ChatbotList.tsx # Chatbot list component
│   │   │   └── AnalyticsChart.tsx # Analytics chart component
│   │   └── chatbot/            # Chatbot components
│   │       ├── ChatInterface.tsx # Chat interface
│   │       ├── MessageBubble.tsx # Message bubble
│   │       └── ChatInput.tsx   # Chat input component
│   ├── lib/                    # Utility libraries
│   │   ├── api.ts              # API client
│   │   └── helpers.ts          # Helper functions
│   ├── mock-data/              # Mock data for development
│   │   ├── chatbots.ts         # Mock chatbot data
│   │   ├── models.ts           # Mock AI model data
│   │   ├── integrations.ts     # Mock integration data
│   │   └── analytics.ts        # Mock analytics data
│   ├── store/                  # State management
│   │   ├── chatStore.ts        # Chat state
│   │   ├── userStore.ts        # User state
│   │   └── chatbotStore.ts     # Chatbot state
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Type definitions
│   └── utils/                  # Utility functions
│       ├── formatting.ts       # Formatting utilities
│       └── validation.ts       # Validation utilities
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## Key Features

### 1. Landing Page

- Modern, responsive design
- Hero section with clear value proposition
- Features section highlighting platform capabilities
- Pricing section with tiered plans
- Testimonials from satisfied customers
- Call-to-action sections

### 2. Dashboard

- Overview of chatbot performance
- Quick access to all chatbots
- Key metrics and statistics
- Recent activity feed
- Quick actions for common tasks

### 3. Chatbot Management

- List of all chatbots with status and metrics
- Create, edit, and delete chatbots
- Preview chatbots in action
- Deploy chatbots to different platforms
- Customize chatbot appearance and behavior

### 4. Chatbot Builder

- No-code interface for building chatbots
- Drag-and-drop components
- Visual conversation flow editor
- Preview changes in real-time
- Save and publish functionality

### 5. Knowledge Base Management

- Upload documents (PDF, DOCX, TXT)
- Import website content
- Create and manage FAQs
- Train chatbot on custom data
- Monitor training progress

### 6. AI Model Selection

- Choose from multiple AI models:
  - Google Gemini (default)
  - OpenAI GPT-4
  - Anthropic Claude
  - Mistral AI
  - Meta Llama 3
- Model comparison and recommendations
- Custom model settings

### 7. Analytics

- Message volume metrics
- User engagement statistics
- Conversation quality metrics
- Conversion tracking
- Custom date range selection
- Exportable reports

### 8. Integrations

- Website widget
- WhatsApp Business
- Slack
- Facebook Messenger
- Shopify
- WordPress
- Custom API integration

### 9. Settings

- Account management
- Billing and subscription
- Team member management
- API keys and webhooks
- Security settings
- Notification preferences

## User Flows

### 1. New User Onboarding

1. Sign up for an account
2. Select a plan (Free, Pro, Business)
3. Create first chatbot
4. Choose AI model
5. Upload knowledge base or start from scratch
6. Customize chatbot appearance
7. Deploy to website or other platform

### 2. Chatbot Creation

1. Navigate to dashboard
2. Click "Create New Chatbot"
3. Enter name and description
4. Select AI model
5. Choose deployment platforms
6. Configure appearance and behavior
7. Add knowledge base (optional)
8. Test chatbot
9. Deploy chatbot

### 3. Knowledge Base Training

1. Navigate to knowledge base section
2. Upload documents or enter website URLs
3. Create FAQs or custom training data
4. Start training process
5. Monitor training progress
6. Test chatbot with new knowledge
7. Publish updated chatbot

### 4. Analytics Review

1. Navigate to analytics section
2. Select chatbot to analyze
3. Choose date range
4. Review key metrics
5. Identify top questions and issues
6. Export reports as needed
7. Make improvements based on insights

## Pricing Structure

### Free Tier

- 1 chatbot
- 1,000 messages per month
- Basic customization
- Website integration only
- Google Gemini AI model
- Email support

### Pro Plan ($29/month)

- 5 chatbots
- 10,000 messages per month
- Advanced customization
- Website & WhatsApp integration
- All AI models
- Knowledge base integration
- Analytics dashboard
- Priority support

### Business Plan ($99/month)

- 20 chatbots
- 50,000 messages per month
- Full customization
- All platform integrations
- All AI models with fine-tuning
- Advanced analytics
- Team collaboration
- API access
- Dedicated support

### Enterprise Plan (Custom pricing)

- Unlimited chatbots
- Custom message volume
- Custom integrations
- Custom AI model deployment
- White-labeling
- SLA guarantees
- Dedicated account manager
- On-premises deployment options

## Backend Architecture (Planned)

### Technology Stack

- **API Layer**: TypeScript with Express.js
- **Core Services**: Golang
- **Database**: PostgreSQL
- **Caching**: Redis
- **File Storage**: AWS S3
- **Search**: Elasticsearch
- **Queue**: RabbitMQ
- **Deployment**: Docker, Kubernetes

### Microservices

1. **Authentication Service** - User management and authentication
2. **Chatbot Service** - Chatbot configuration and management
3. **Conversation Service** - Message handling and routing
4. **Knowledge Service** - Document processing and knowledge base management
5. **AI Service** - AI model integration and management
6. **Analytics Service** - Data collection and reporting
7. **Integration Service** - Third-party platform integrations

## Development Roadmap

### Phase 1: Frontend Development (Current)

- Set up Next.js project with TypeScript
- Implement landing page components
- Create dashboard UI with mock data
- Build chatbot interface components
- Develop no-code builder interface

### Phase 2: Backend API Development

- Set up Golang and TypeScript services
- Implement authentication and user management
- Create chatbot configuration endpoints
- Develop knowledge base management APIs
- Build analytics data collection endpoints

### Phase 3: AI Model Integration

- Integrate Google Gemini as core model
- Add support for OpenAI GPT-4
- Implement Claude and Mistral integrations
- Create model selection and configuration
- Develop training pipeline for custom data

### Phase 4: Platform Integrations

- Website widget implementation
- WhatsApp Business integration
- Slack app development
- Facebook Messenger integration
- Shopify and WordPress plugins

### Phase 5: Advanced Features

- Team collaboration tools
- Advanced analytics and reporting
- Custom AI model fine-tuning
- Enterprise security features
- White-labeling options
