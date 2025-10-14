# API Reference

## Endpoints

### Chat Endpoint

**POST** `/api/chat`

Send messages to the bot and receive responses.

#### Request Body

```json
{
  "message": "Hello, how can you help me?",
  "history": [],
  "agentId": "4k8afeknd"
}
```

#### Response

```json
{
  "reply": "Hello! I'm here to help you with any questions you have.",
  "status": "success"
}
```

### Bot Configuration

**GET** `/api/chatagents/{botId}/appearance`

Retrieve bot appearance settings.

#### Response

```json
{
  "data": {
    "primary_color": "#3B82F6",
    "welcome_message": "Hello! How can I help you today?",
    "position": "bottom-right"
  }
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `404` - Bot not found
- `500` - Server error

Error responses include:
```json
{
  "error": "Error message",
  "status": "error"
}
```