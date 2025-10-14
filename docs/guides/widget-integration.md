---
title: Widget Integration
sidebar_position: 1
---

The Boltz widget is a floating chat interface you can embed in any site or app. All methods require setting `window.BOLTZ_CONFIG` before the loader script executes.

## Basic Two-Script Pattern

```html
<script>
  window.BOLTZ_CONFIG = {
    botId: "your-bot-id",
    apiUrl: "http://localhost:3000/api",
  };
</script>
<script src="http://localhost:3000/widget.js" async></script>
```

## Method 1: Plain HTML (Global)

```html
<head>
  <script>
    window.BOLTZ_CONFIG = {
      botId: "4k8afeknd",
      apiUrl: "http://localhost:3000/api",
    };
  </script>
  <script src="http://localhost:3000/widget.js" async></script>
</head>
```

## Method 2: Next.js Root Layout

```tsx
// app/layout.tsx
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
            __html: `window.BOLTZ_CONFIG = { botId: "4k8afeknd", apiUrl: "http://localhost:3000/api" };`,
          }}
        />
        <script src="http://localhost:3000/widget.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Method 3: Reusable React Component

```tsx
import Script from "next/script";

export function BoltzWidget({
  botId,
  apiUrl = "http://localhost:3000/api",
}: {
  botId: string;
  apiUrl?: string;
}) {
  return (
    <>
      <Script
        id="boltz-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.BOLTZ_CONFIG = { botId: "${botId}", apiUrl: "${apiUrl}" };`,
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

## Method 4: Custom Hook (Dynamic Control)

```tsx
import { useEffect } from "react";

export function useBoltzWidget({
  botId,
  apiUrl = "http://localhost:3000/api",
}: {
  botId: string;
  apiUrl?: string;
}) {
  useEffect(() => {
    (window as any).BOLTZ_CONFIG = { botId, apiUrl };
    const script = document.createElement("script");
    script.src = "http://localhost:3000/widget.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.getElementById("boltz-widget")?.remove();
      script.remove();
    };
  }, [botId, apiUrl]);
}
```

## Method 5: Conditional / Lazy Load

```tsx
if (shouldShow) {
  window.BOLTZ_CONFIG = {
    botId: "4k8afeknd",
    apiUrl: "http://localhost:3000/api",
  };
  const script = document.createElement("script");
  script.src = "http://localhost:3000/widget.js";
  script.async = true;
  document.head.appendChild(script);
}
```

## Configuration Fields

| Field  | Type   | Required | Description                        |
| ------ | ------ | -------- | ---------------------------------- |
| botId  | string | Yes      | Your bot identifier                |
| apiUrl | string | Yes      | Base API endpoint (include `/api`) |

## Troubleshooting

| Symptom          | Cause                      | Fix                                   |
| ---------------- | -------------------------- | ------------------------------------- |
| Widget missing   | Config loaded after script | Move config before loader script      |
| 404 appearance   | Wrong path (missing /api)  | Ensure `apiUrl` ends with `/api`      |
| JSON parse error | Non‑JSON 404 body          | Verify endpoint exists & returns JSON |

Next: see [Widget Customization](./widget-customization.md).
