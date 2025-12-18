# Level-x Widget Integration Guide

## Overview

The Level-x widget is a chat interface that can be embedded into any web application. It provides a floating chat bubble that opens a chat window when clicked.

## Basic Setup

All integration methods require two scripts:

1. Configuration script with your bot ID
2. Widget script from the Level-x server

```html
<script>
  window.LEVEL_X_CONFIG = {
    botId: "your-bot-id",
    apiUrl: "http://localhost:3000/api",
  };
</script>
<script src="http://localhost:3000/widget.js" async></script>
```

## Integration Methods

### Method 1: Global Integration (HTML)

Add to your HTML `<head>` section for site-wide availability:

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      window.LEVEL_X_CONFIG = {
        botId: "4k8afeknd",
        apiUrl: "http://localhost:3000/api",
      };
    </script>
    <script src="http://localhost:3000/widget.js" async></script>
  </head>
  <body>
    <!-- Your content -->
  </body>
</html>
```

### Method 2: Next.js Root Layout

For Next.js applications, add to `app/layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.LEVEL_X_CONFIG = {
                agentId: "4k8afeknd",
                apiUrl: "http://localhost:3000/api"
              };
            `,
          }}
        />
        <script src="http://localhost:3000/widget.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Method 3: React Component

Create a reusable component:

```tsx
"use client";
import Script from "next/script";

interface LevelXWidgetProps {
  agentId: string;
  apiUrl?: string;
}

export default function LevelXWidget({
  agentId,
  apiUrl = "http://localhost:3000/api",
}: LevelXWidgetProps) {
  return (
    <>
      <Script
        id="level-x-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.LEVEL_X_CONFIG = {
              agentId: "${agentId}",
              apiUrl: "${apiUrl}"
            };
          `,
        }}
      />
      <Script
        src="http://localhost:3000/widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}
```

Use in your components:

```tsx
<LevelXWidget agentId="4k8afeknd" />
```

### Method 4: React Hook

Create a custom hook for programmatic control:

```tsx
"use client";
import { useEffect } from "react";

interface LevelXConfig {
  agentId: string;
  apiUrl?: string;
}

export function useLevelXWidget(config: LevelXConfig) {
  useEffect(() => {
    (window as any).LEVEL_X_CONFIG = {
      agentId: config.agentId,
      apiUrl: config.apiUrl || "http://localhost:3000/api",
    };

    const script = document.createElement("script");
    script.src = "http://localhost:3000/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const widget = document.getElementById("level-x-widget");
      if (widget) widget.remove();
      document.head.removeChild(script);
    };
  }, [config.agentId, config.apiUrl]);
}
```

Use in components:

```tsx
function MyComponent() {
  useLevelXWidget({ agentId: "4k8afeknd" });
  return <div>Your content</div>;
}
```

### Method 5: Dynamic Loading

For conditional loading:

```tsx
useEffect(() => {
  if (shouldShowWidget) {
    (window as any).LEVEL_X_CONFIG = {
      agentId: "4k8afeknd",
      apiUrl: "http://localhost:3000/api",
    };

    const script = document.createElement("script");
    script.src = "http://localhost:3000/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }
}, [shouldShowWidget]);
```

## Configuration Options

| Option    | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| `agentId` | string | Yes      | Your unique agent identifier |
| `apiUrl`  | string | Yes      | API endpoint URL             |

## Widget Behavior

- Appears as a floating chat bubble (bottom-right by default)
- Click to open/close chat window
- Connects to your API endpoint for responses
- Automatically handles message history
- Responsive design for mobile/desktop

## Troubleshooting

**Widget not appearing:**

- Check browser console for errors
- Verify `LEVEL_X_CONFIG` is set before widget script loads
- Ensure agent ID is correct

**API errors:**

- Verify API URL is accessible
- Check CORS settings on your server
- Confirm agent ID exists in your system
