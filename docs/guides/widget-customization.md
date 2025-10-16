---
title: Widget Customization
sidebar_position: 2
---

Appearance is driven by the bot appearance API plus optional CSS overrides.

## Appearance Properties

```json
{
  "primary_color": "#3B82F6",
  "position": "bottom-right",
  "welcome_message": "Hello! How can I help you today?"
}
```

## Positions

`bottom-right` (default) or `bottom-left`.

## CSS Overrides

```css
#boltz-bubble {
  width: 70px;
  height: 70px;
}
#boltz-chat {
  width: 400px;
  height: 600px;
}
```

## Programmatic Access

```js
if (window.BOLTZ_CONFIG) {
  console.log("Bot:", window.BOLTZ_CONFIG.botId);
}
```

## Hiding / Showing

```js
document.getElementById("boltz-widget").style.display = "none";
```

Continue to API reference for dynamic updates.
