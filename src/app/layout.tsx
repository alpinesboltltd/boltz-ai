import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/ToastProvider";

import { Header } from "@/components/common/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Level-X | Level 4 Autonomous Digital Employees",
  description:
    "Beyond automation. Level X provides Level 4 autonomous digital employees to handle complex workflows independently. Deploy the future of work today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.LEVEL_X_CONFIG = { id: "2e5f22e6-667c-4733-a862-82b3388c4d89" };
            `,
          }}
        />
        <script src="https://level-x.alpinesbolt.com/widget.js" async />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans w-full overflow-x-hidden">
        <Header />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
