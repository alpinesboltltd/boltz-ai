# Boltz Widget Integration Guide

## Overview

The Boltz widget is a chat interface that can be embedded into any web application. It provides a floating chat bubble that opens a chat window when clicked.

## Basic Setup

All integration methods require two scripts:
1. Configuration script with your bot ID
2. Widget script from the Boltz server

```html
<script>
  window.BOLTZ_CONFIG = {
    botId: "your-bot-id",
    apiUrl: "http://localhost:3000/api"
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
    window.BOLTZ_CONFIG = {
      botId: "4k8afeknd",
      apiUrl: "http://localhost:3000/api"
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
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.BOLTZ_CONFIG = {
                botId: "4k8afeknd",
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

interface BoltzWidgetProps {
  botId: string;
  apiUrl?: string;
}

export default function BoltzWidget({ 
  botId, 
  apiUrl = "http://localhost:3000/api" 
}: BoltzWidgetProps) {
  return (
    <>
      <Script
        id="boltz-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.BOLTZ_CONFIG = {
              botId: "${botId}",
              apiUrl: "${apiUrl}"
            };
          `,
        }}
      />
      <Script src="http://localhost:3000/widget.js" strategy="afterInteractive" />
    </>
  );
}
```

Use in your components:
```tsx
<BoltzWidget botId="4k8afeknd" />
```

### Method 4: React Hook

Create a custom hook for programmatic control:

```tsx
"use client";
import { useEffect } from "react";

interface BoltzConfig {
  botId: string;
  apiUrl?: string;
}

export function useBoltzWidget(config: BoltzConfig) {
  useEffect(() => {
    (window as any).BOLTZ_CONFIG = {
      botId: config.botId,
      apiUrl: config.apiUrl || "http://localhost:3000/api",
    };

    const script = document.createElement("script");
    script.src = "http://localhost:3000/widget.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const widget = document.getElementById("boltz-widget");
      if (widget) widget.remove();
      document.head.removeChild(script);
    };
  }, [config.botId, config.apiUrl]);
}
```

Use in components:
```tsx
function MyComponent() {
  useBoltzWidget({ botId: "4k8afeknd" });
  return <div>Your content</div>;
}
```

### Method 5: Dynamic Loading

For conditional loading:

```tsx
useEffect(() => {
  if (shouldShowWidget) {
    (window as any).BOLTZ_CONFIG = {
      botId: "4k8afeknd",
      apiUrl: "http://localhost:3000/api"
    };
    
    const script = document.createElement("script");
    script.src = "http://localhost:3000/widget.js";
    script.async = true;
    document.head.appendChild(script);
  }
}, [shouldShowWidget]);
```

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `botId` | string | Yes | Your unique bot identifier |
| `apiUrl` | string | Yes | API endpoint URL |

## Widget Behavior

- Appears as a floating chat bubble (bottom-right by default)
- Click to open/close chat window
- Connects to your API endpoint for responses
- Automatically handles message history
- Responsive design for mobile/desktop

## Troubleshooting

**Widget not appearing:**
- Check browser console for errors
- Verify `BOLTZ_CONFIG` is set before widget script loads
- Ensure bot ID is correct

**API errors:**
- Verify API URL is accessible
- Check CORS settings on your server
- Confirm bot ID exists in your system