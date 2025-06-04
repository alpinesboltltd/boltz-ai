# Boltz-ai - AI Chatbot Platform

An AI-powered chatbot platform modeled after Chatbase.co, incorporating its pricing structure, documentation, and user interface.

## Project Overview

Boltz.co is a no-code AI chatbot builder that allows users to create custom chatbots powered by various AI models including Google Gemini, GPT-4, Claude, and Mistral. The platform enables businesses to train chatbots with their own knowledge base, deploy them across multiple channels, and track performance with advanced analytics.

## Tech Stack

### Frontend
- Next.js v15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Chart.js for analytics visualizations
- Zustand for state management

### Backend (Planned)
- Golang for core services
- TypeScript for API layers
- PostgreSQL for relational data
- Redis for caching
- AWS S3 for file storage

## Features

### Core Features
- **Custom AI Model Selection**: Support for Google Gemini, GPT-4, Claude, Mistral, and other AI models
- **Knowledge Base Integration**: Upload documents, FAQs, and website data to train the chatbot
- **Real-time Chatbot Training**: Dynamic training and updating of chatbot responses
- **No-Code Chatbot Builder**: Intuitive interface for non-technical users
- **Advanced Analytics**: Track user interactions, conversation quality, and conversion metrics
- **Multi-channel Integration**: Deploy on websites, WhatsApp, Slack, Shopify, and other platforms
- **Customization Options**: Personalize chatbot appearance, behavior, and responses
- **Multilingual Support**: Support for 80+ languages

## Project Structure

```
boltz.co/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── chatbot/            # Chatbot pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── common/             # Common components (Header, Footer, etc.)
│   │   ├── landing/            # Landing page components
│   │   ├── dashboard/          # Dashboard components
│   │   └── chatbot/            # Chatbot components
│   ├── lib/                    # Utility libraries
│   ├── mock-data/              # Mock data for development
│   ├── store/                  # State management
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## Pages

### Landing Pages
- **Home**: Main landing page with hero section, features, pricing, and testimonials
- **Features**: Detailed feature descriptions
- **Pricing**: Pricing plans and comparison
- **Documentation**: User guides and API documentation
- **Blog**: Articles and updates

### Dashboard Pages
- **Dashboard**: Overview of chatbots, analytics, and recent activity
- **Chatbot Builder**: No-code interface for building and customizing chatbots
- **Knowledge Base**: Upload and manage training data
- **Analytics**: Performance metrics and user insights
- **Settings**: Account and billing settings

### Chatbot Pages
- **Chatbot Demo**: Live preview of the chatbot
- **Chatbot Settings**: Configuration options for the chatbot
- **Training**: Interface for training and improving the chatbot

## Pricing Structure

- **Free Tier**: Basic features, limited messages per month
- **Pro Plan**: $29/month - Full features, higher message limits, priority support
- **Business Plan**: $99/month - Advanced analytics, team collaboration, API access
- **Enterprise Plan**: Custom pricing - Dedicated support, SLA, custom integrations

## Development Roadmap

1. **Phase 1**: Frontend development with mock data
   - Landing pages
   - Dashboard UI
   - Chatbot builder interface

2. **Phase 2**: Backend API implementation
   - User authentication
   - Chatbot configuration storage
   - Knowledge base management

3. **Phase 3**: AI model integration
   - Google Gemini integration
   - Additional AI model support
   - Training pipeline

4. **Phase 4**: Analytics and dashboard features
   - Performance metrics
   - User interaction tracking
   - Conversion analytics

5. **Phase 5**: Multi-channel deployment
   - Website widget
   - WhatsApp integration
   - Slack integration
   - Additional platform support

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## License

MIT