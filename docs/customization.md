# Widget Customization

## Configuration Options

The widget appearance is controlled by the bot configuration API. The following options are available:

### Colors

```json
{
  "primary_color": "#3B82F6"
}
```

### Position

```json
{
  "position": "bottom-right" // or "bottom-left"
}
```

### Welcome Message

```json
{
  "welcome_message": "Hello! How can I help you today?"
}
```

## CSS Customization

The widget uses inline styles but can be customized with CSS:

```css
/* Hide the widget */
#level-x-widget {
  display: none !important;
}

/* Customize bubble size */
#level-x-bubble {
  width: 70px !important;
  height: 70px !important;
}

/* Customize chat window */
#level-x-chat {
  width: 400px !important;
  height: 600px !important;
}
```

## JavaScript API

Access widget programmatically:

```javascript
// Check if widget is loaded
if (window.LEVEL_X_CONFIG) {
  console.log("Widget configured for bot:", window.LEVEL_X_CONFIG.botId);
}

// Hide/show widget
const widget = document.getElementById("level-x-widget");
if (widget) {
  widget.style.display = "none"; // Hide
  widget.style.display = "block"; // Show
}
```
