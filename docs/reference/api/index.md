---
title: API Reference
sidebar_position: 1
---

## Chat

**POST** `/api/chat`

Request:

```json
{ "message": "Hello", "history": [], "agentId": "4k8afeknd" }
```

Response:

```json
{ "reply": "Hi!", "status": "success" }
```

## Bot Appearance

**GET** `/api/chatagents/{botId}/appearance`

Response:

```json
{
  "data": {
    "primary_color": "#3B82F6",
    "welcome_message": "Hello! How can I help you today?",
    "position": "bottom-right"
  }
}
```

## Errors

| Status | Meaning          |
| ------ | ---------------- |
| 200    | Success          |
| 400    | Validation issue |
| 404    | Not found        |
| 500    | Server error     |

Error body:

```json
{ "error": "Message", "status": "error" }
```

More endpoints coming as backend services harden.
