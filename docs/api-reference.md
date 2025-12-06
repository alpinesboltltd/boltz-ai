# API Reference

## Authentication

All API requests (except login/signup) require a Bearer token in the Authorization header.

```
Authorization: Bearer <your_jwt_token>
```

## Agents

### Create Agent
`POST /api/v1/agent/create`

### Get Agents
`GET /api/v1/agent/agents/:userId`

### Get Agent Details
`GET /api/v1/agent/:agentId`

### Update Agent
`PATCH /api/v1/agent/update/:agentId`

### Delete Agent
`DELETE /api/v1/agent/:agentId`

## Agent Configuration

### Appearance
- `POST /api/v1/agent/create/appearance`
- `GET /api/v1/agent/:agentId/appearance`
- `PATCH /api/v1/agent/:agentId/appearance`
- `DELETE /api/v1/agent/:agentId/appearance`

### Behavior
- `POST /api/v1/agent/create/behavior`
- `GET /api/v1/agent/:agentId/behavior`
- `PATCH /api/v1/agent/:agentId/behavior`
- `DELETE /api/v1/agent/:agentId/behavior`

### Channels
- `POST /api/v1/agent/create/channel`
- `GET /api/v1/agent/:agentId/channel`
- `PATCH /api/v1/agent/:agentId/channel`
- `DELETE /api/v1/agent/:agentId/channel`

### Integrations
- `POST /api/v1/agent/create/integration`
- `GET /api/v1/agent/:agentId/integration`
- `PATCH /api/v1/agent/:agentId/integration`
- `DELETE /api/v1/agent/:agentId/integration`

### Stats
- `GET /api/v1/agent/:agentId/stats`
- `DELETE /api/v1/agent/:agentId/stats`

## System

### Instructions
- `POST /api/v1/system/instructions`
- `GET /api/v1/system/instructions`
- `GET /api/v1/system/instructions/:id`
- `PATCH /api/v1/system/instructions/:id`
- `DELETE /api/v1/system/instructions/:id`

### Templates
- `POST /api/v1/system/templates`
- `GET /api/v1/system/templates`
- `GET /api/v1/system/templates/:id`

## Scraper

### Scrape URL
`POST /api/v1/scrape`

Request Body:
```json
{
  "url": "https://example.com",
  "trace": true,
  "exclude": [],
  "max_pages": 1
}
```

## Chat

### Send Message
`POST /api/v1/chat`

Request Body:
```json
{
  "message": "Hello",
  "history": [],
  "agentId": "agent-id"
}
```