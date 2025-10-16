# Analytics Data Schema

This document defines the data schema for analytics in the Boltz-ai platform.

## Core Analytics Tables

### agent_stats
Aggregated performance metrics per agent.

```json
{
  "id": "string",
  "agent_id": "string",
  "total_messages": "number",
  "unique_users": "number", 
  "average_rating": "number (0-5)",
  "response_rate": "number (0-1)",
  "conversions_count": "number",
  "last_calculated_at": "ISO 8601 timestamp"
}
```

### conversations
Individual chat sessions between users and agents.

```json
{
  "id": "string",
  "agent_id": "string",
  "platform": "string (Website|WhatsApp|Slack|etc.)",
  "client_id": "string|null",
  "title": "string",
  "created_at": "ISO 8601 timestamp",
  "status": "string (open|closed)",
  "escalated_to_human": "boolean",
  "escalation_reason": "string|null"
}
```

### messages
Individual messages within conversations.

```json
{
  "id": "string",
  "convo_id": "string",
  "role": "string (user|assistant)",
  "text": "string",
  "timestamp": "ISO 8601 timestamp",
  "confidence_score": "number (0-1)"
}
```

### message_metadata
AI analysis metadata for messages.

```json
{
  "id": "string",
  "msg_id": "string",
  "sentiment": "string (positive|neutral|negative|frustrated)",
  "intent": "string",
  "msg_type": "string (text|image|file)",
  "token_count": "number"
}
```

### analytics_questions
Most frequently asked questions with analytics data.

```json
{
  "id": "string",
  "agent_id": "string",
  "question": "string",
  "category": "string",
  "count": "number",
  "last_asked": "ISO 8601 timestamp"
}
```

## Calculated Analytics Metrics

### Performance Metrics
- **Total Messages**: Sum of all messages for selected agents/timeframe
- **Unique Users**: Count of distinct client_ids in conversations
- **Average Rating**: Weighted average from agent_stats
- **Response Rate**: Ratio of assistant messages to user messages
- **Escalation Rate**: Percentage of conversations escalated to humans
- **Average Response Time**: Time between user message and assistant response
- **Average Session Duration**: Time from first to last message in conversation
- **Conversion Count**: Total conversions from agent_stats

### Time Series Metrics
- **Messages by Day**: Daily message counts over time period
- **Users by Day**: Daily unique user counts
- **Conversations by Day**: Daily new conversation counts
- **Conversations by Hour**: Hourly distribution (0-23)

### Sentiment Analysis
- **Positive Percentage**: % of messages with positive sentiment
- **Neutral Percentage**: % of messages with neutral sentiment  
- **Negative Percentage**: % of messages with negative sentiment

### User Satisfaction
- **Satisfied**: Users with positive experience (derived from ratings)
- **Neutral**: Users with neutral experience
- **Unsatisfied**: Users with negative experience

### Platform Distribution
- **Platform**: Platform name (Website, WhatsApp, etc.)
- **Percentage**: % of conversations on this platform
- **Count**: Number of conversations on this platform

## Data Processing Rules

### Time Range Filtering
- **7d**: Last 7 days from current date
- **30d**: Last 30 days from current date  
- **90d**: Last 90 days from current date

### Agent Filtering
- **all**: Include data from all agents
- **{agent_id}**: Include data only from specified agent

### Sentiment Mapping
- **positive**: sentiment = "positive" OR "helpful"
- **neutral**: sentiment = "neutral" 
- **negative**: sentiment = "negative" OR "frustrated" OR "dissatisfied"

### Platform Standardization
- Normalize platform names (e.g., "website" → "Website")
- Group similar platforms if needed

### Data Validation
- Ensure all timestamps are valid ISO 8601 format
- Validate foreign key relationships (agent_id, convo_id, msg_id)
- Handle null/missing values appropriately
- Apply reasonable bounds to numeric values (ratings 0-5, rates 0-1)

## API Response Format

### Analytics Endpoint Response
```json
{
  "metrics": {
    "totalMessages": "number",
    "uniqueUsers": "number", 
    "avgRating": "number",
    "responseRate": "number",
    "conversionsCount": "number",
    "escalationRate": "number",
    "avgSessionDuration": "number",
    "avgResponseTime": "number"
  },
  "timeline": [
    {
      "date": "YYYY-MM-DD",
      "messages": "number",
      "users": "number", 
      "conversations": "number"
    }
  ],
  "topQuestions": [
    {
      "question": "string",
      "count": "number",
      "category": "string"
    }
  ],
  "userSatisfaction": {
    "satisfied": "number",
    "neutral": "number",
    "unsatisfied": "number"
  },
  "platformDistribution": [
    {
      "platform": "string",
      "percentage": "number",
      "count": "number"
    }
  ],
  "sentimentAnalysis": [
    {
      "date": "YYYY-MM-DD",
      "positive": "number (0-100)",
      "neutral": "number (0-100)", 
      "negative": "number (0-100)"
    }
  ],
  "conversationsByHour": "number[24]",
  "agents": [
    {
      "id": "string",
      "name": "string"
    }
  ]
}
```