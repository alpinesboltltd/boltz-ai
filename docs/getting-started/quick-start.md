---
title: Quick Start
sidebar_position: 2
---

Embed the Boltz widget on any page with two scripts: configuration + loader.

```html
<script>
  window.BOLTZ_CONFIG = {
    botId: "your-bot-id",
    apiUrl: "http://localhost:3000/api",
  };
</script>
<script src="http://localhost:3000/widget.js" async></script>
```

## Steps

1. Create or identify a bot ID from your dashboard (placeholder process during early development)
2. Add the configuration script before the widget loader tag
3. Deploy / serve `widget.js` from your Next.js public directory (default path: `/widget.js`)
4. Verify in DevTools Console that no 404s or CORS errors occur

## Basic Verification Checklist

- Network tab shows 200 for `/widget.js`
- A request to `/api/chatagents/{botId}/appearance` succeeds (or returns JSON 404 with structured error)
- A floating chat bubble renders in the bottom-right corner

For framework‑specific usage (Next.js component, hook, dynamic load) see the integration guide under Guides.

## Next Steps

- Configure appearance → Guides / Widget Customization
- Send first message via API → Reference / Chat Endpoint
- Ingest knowledge sources (roadmap) → Upcoming Architecture notes
