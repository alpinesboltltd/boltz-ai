"use client";

import Script from "next/script";

interface BoltzWidgetProps {
  id: string;
}

export default function BoltzWidget({ id }: BoltzWidgetProps) {
  return (
    <>
      <Script
        id="4k8afeknd"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.BOLTZ_CONFIG = {
              id: "${id}",
            };
          `,
        }}
      />
      <Script
        src="http://192.168.1.162:3000/widget.js"
        strategy="afterInteractive"
      />
    </>
  );
}
