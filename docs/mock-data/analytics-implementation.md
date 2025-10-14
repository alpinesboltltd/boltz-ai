# Analytics Implementation Guide

This document explains how the analytics system is implemented in the Boltz-ai platform.

## Architecture Overview

The analytics system follows a layered architecture:

1. **Data Layer**: Mock data in `db.json` with realistic relationships
2. **Processing Layer**: `AnalyticsProcessor` class for data aggregation
3. **API Layer**: REST endpoint at `/api/analytics`
4. **Presentation Layer**: React components with Chart.js visualizations

## Data Flow

```
db.json → AnalyticsProcessor → API Route → React Components → Charts
```

### 1. Data Storage (db.json)

Raw data is stored in structured JSON format:
- `agent_stats`: Aggregated metrics per agent
- `conversations`: Individual chat sessions
- `messages`: Individual messages within conversations
- `message_metadata`: AI analysis (sentiment, intent)
- `analytics_questions`: Popular questions with counts

### 2. Data Processing (AnalyticsProcessor)

The processor handles:
- **Filtering**: By agent ID and time range
- **Aggregation**: Calculating metrics from raw data
- **Time Series**: Grouping data by date/hour
- **Relationships**: Joining related data tables

Key methods:
- `processDbData()`: Main entry point
- `calculateMetrics()`: Core performance metrics
- `processTimeSeriesData()`: Daily/hourly trends
- `processSentimentData()`: Sentiment analysis over time

### 3. API Endpoint (/api/analytics)

RESTful endpoint that:
- Accepts query parameters: `timeRange`, `agentId`
- Reads data from `db.json`
- Processes data using `AnalyticsProcessor`
- Returns structured JSON response

### 4. Frontend Components

#### Analytics Page (`/dashboard/analytics`)
- Main dashboard with filters and charts
- Real-time data loading with error handling
- Export functionality (CSV/PDF)
- Responsive design for all screen sizes

#### Analytics Insights Component
- AI-powered insights and recommendations
- Performance analysis and suggestions
- Interactive insight cards with details

## Key Features

### Performance Metrics
- **Total Messages**: Sum across selected agents/timeframe
- **Unique Users**: Distinct user count
- **Response Rate**: Assistant responses / User messages
- **Average Rating**: Weighted average from agent stats
- **Escalation Rate**: % conversations escalated to humans
- **Conversion Count**: Total conversions achieved

### Time Series Analysis
- **Daily Trends**: Messages, users, conversations over time
- **Hourly Patterns**: Activity distribution by hour (0-23)
- **Sentiment Trends**: Positive/neutral/negative over time

### User Experience Metrics
- **Satisfaction Distribution**: Satisfied/neutral/unsatisfied users
- **Platform Performance**: Conversation distribution by platform
- **Session Analytics**: Average duration and response times

### Insights Engine
Automated analysis providing:
- Performance strengths and weaknesses
- Optimization recommendations
- Trend identification
- Anomaly detection

## Data Consistency

### Referential Integrity
- All `agent_id` references point to valid agents
- All `convo_id` references point to valid conversations
- All `msg_id` references point to valid messages

### Temporal Consistency
- Timestamps follow chronological order
- Message timestamps within conversation bounds
- Analytics data reflects actual message activity

### Categorical Consistency
- Standardized platform names (Website, WhatsApp, etc.)
- Consistent sentiment values (positive, neutral, negative)
- Aligned question categories across training and analytics data

## Performance Optimizations

### Frontend
- **Memoization**: `useMemo` for expensive calculations
- **Chart Optimization**: Reduced animation, efficient rendering
- **Error Boundaries**: Graceful error handling
- **Loading States**: Progressive data loading

### Backend
- **Data Filtering**: Early filtering to reduce processing
- **Caching**: Potential for Redis caching (future)
- **Pagination**: For large datasets (future)

### Charts
- **Interaction Modes**: Optimized hover and tooltip behavior
- **Element Sizing**: Appropriate point sizes and grid display
- **Color Schemes**: Consistent, accessible color palette

## Error Handling

### Data Validation
- Null/undefined checks for all data access
- Safe division operations (prevent divide by zero)
- Array bounds checking
- Type validation for numeric operations

### User Experience
- Loading spinners during data fetch
- Error messages with retry options
- Empty state handling for no data scenarios
- Graceful degradation for missing features

## Export Functionality

### CSV Export
- Structured data export for external analysis
- Includes all key metrics and time series data
- Proper formatting for spreadsheet applications

### PDF Reports
- Professional report generation
- Charts and metrics in printable format
- Branded layout with company information

## Future Enhancements

### Real-time Updates
- WebSocket connections for live data
- Real-time chart updates
- Push notifications for alerts

### Advanced Analytics
- Machine learning insights
- Predictive analytics
- Anomaly detection algorithms
- Custom metric definitions

### Performance Scaling
- Database optimization
- Caching strategies
- Data partitioning
- Background processing

## Testing Strategy

### Unit Tests
- AnalyticsProcessor methods
- Data validation functions
- Chart data transformations

### Integration Tests
- API endpoint responses
- Database query accuracy
- Component rendering with real data

### Performance Tests
- Large dataset handling
- Chart rendering performance
- Memory usage optimization

## Monitoring and Observability

### Metrics to Track
- API response times
- Data processing duration
- Chart rendering performance
- User interaction patterns

### Error Monitoring
- Failed data loads
- Chart rendering errors
- Export functionality issues
- User experience problems