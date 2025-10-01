# Mock Data Documentation

This document describes the structure and relationships of the mock data used in the Boltz-ai chatbot platform.

## Overview

The mock data is stored in `mock-data/db.json` and simulates a complete chatbot analytics system with realistic data relationships. All data is consistent and interconnected to provide accurate analytics and insights.

## Data Structure

### Core Entities

#### Users
- **Purpose**: System users who own and manage chatbots
- **Key Fields**: `id`, `name`, `email`, `role`, `avatar`
- **Sample Data**: 1 admin user (Grace Ajayi)

#### Agents (Chatbots)
- **Purpose**: AI chatbots created by users
- **Key Fields**: `id`, `user_id`, `name`, `description`, `ai_model`, `status`
- **Sample Data**: 1 active agent "Besty" using GPT-4 Turbo
- **Relationships**: Belongs to a user

#### Agent Configuration
- **agent_appearance**: Visual customization (colors, position, icons)
- **agent_behavior**: Behavioral settings (messages, handoff rules)
- **agent_integrations**: Platform connections (WhatsApp, Website, etc.)

### Analytics Data

#### Agent Stats
- **Purpose**: Aggregated performance metrics per agent
- **Key Fields**: `total_messages`, `unique_users`, `average_rating`, `response_rate`, `conversions_count`
- **Sample Data**: 
  - Agent "4k8afeknd": 2,847 messages, 486 users, 4.6 rating, 92% response rate
  - Agent "3": 156 messages, 42 users, 4.2 rating, 87% response rate

#### Conversations
- **Purpose**: Individual chat sessions between users and agents
- **Key Fields**: `id`, `agent_id`, `platform`, `client_id`, `created_at`, `escalated_to_human`
- **Sample Data**: 8 conversations across different platforms and time periods
- **Relationships**: Belongs to an agent, contains multiple messages

#### Messages
- **Purpose**: Individual messages within conversations
- **Key Fields**: `id`, `convo_id`, `role` (user/assistant), `text`, `timestamp`, `confidence_score`
- **Sample Data**: Realistic conversation flows with timestamps
- **Relationships**: Belongs to a conversation

#### Message Metadata
- **Purpose**: AI analysis of messages (sentiment, intent, tokens)
- **Key Fields**: `msg_id`, `sentiment`, `intent`, `token_count`
- **Sample Data**: Varied sentiments (positive, neutral, negative) and intents
- **Relationships**: One-to-one with messages

#### Analytics Questions
- **Purpose**: Most frequently asked questions with counts and categories
- **Key Fields**: `agent_id`, `question`, `category`, `count`, `last_asked`
- **Sample Data**: 10 questions ranging from 78 to 30 occurrences
- **Categories**: General, Account, Shipping, Returns, Orders, Payment, Support, Product
- **Relationships**: Belongs to an agent

#### Training Data
- **Purpose**: Knowledge base content used to train agents
- **Key Fields**: `agent_id`, `content_type`, `category`, `title`, `content`, `intent`
- **Sample Data**: FAQ entries matching common questions
- **Relationships**: Belongs to an agent, correlates with analytics questions

### System Configuration

#### Actions
- **core_actions**: Built-in chatbot capabilities (Answer FAQs, Escalate to Human)
- **system_actions**: Advanced integrations (Book Meeting, Check Order Status, etc.)
- **custom_actions**: User-defined workflows (currently empty)

#### Integration Providers
- **Purpose**: Available third-party service integrations
- **Types**: Calendar (Google Calendar, Calendly), CRM (Salesforce, HubSpot), Payment (Stripe, Paystack)
- **Configuration**: Authentication methods and required fields

## Data Relationships

```
Users (1) → (many) Agents
Agents (1) → (1) Agent_Appearance
Agents (1) → (1) Agent_Behavior  
Agents (1) → (many) Agent_Integrations
Agents (1) → (1) Agent_Stats
Agents (1) → (many) Conversations
Agents (1) → (many) Analytics_Questions
Agents (1) → (many) Training_Data

Conversations (1) → (many) Messages
Messages (1) → (1) Message_Metadata
```

## Analytics Calculations

### Key Metrics
- **Total Messages**: Sum of all messages across selected agents
- **Unique Users**: Count of distinct client_ids in conversations
- **Average Rating**: Weighted average from agent_stats
- **Response Rate**: Percentage of user messages that received responses
- **Escalation Rate**: Percentage of conversations escalated to humans
- **Conversion Rate**: Conversions divided by unique users

### Time Series Data
- **Messages by Day**: Count of messages grouped by date
- **Users by Day**: Count of unique users per day
- **Conversations by Day**: Count of new conversations per day
- **Hourly Activity**: Distribution of conversations by hour of day

### Sentiment Analysis
- **Positive**: Messages with positive sentiment from metadata
- **Neutral**: Messages with neutral sentiment
- **Negative**: Messages with negative/frustrated sentiment

### Platform Distribution
- **Website**: Primary platform for most conversations
- **WhatsApp**: Secondary platform
- **Other**: Additional platforms as configured

## Data Consistency Rules

1. **Agent References**: All conversations, stats, questions, and training data reference valid agent IDs
2. **Message Relationships**: All messages belong to existing conversations
3. **Metadata Alignment**: Message metadata exists for all messages with valid sentiment/intent values
4. **Timestamp Consistency**: All timestamps follow ISO 8601 format and logical chronological order
5. **Category Consistency**: Question categories match training data categories
6. **Platform Consistency**: Platform names are standardized across conversations and integrations

## Usage in Analytics

The analytics system processes this data to generate:
- Real-time performance dashboards
- Trend analysis over time
- User satisfaction metrics
- Popular question identification
- Platform performance comparison
- Sentiment tracking
- Escalation pattern analysis

All calculations are performed by the `AnalyticsProcessor` class in `/src/lib/analytics.ts`, which ensures data consistency and proper aggregation across different time ranges and agent selections.