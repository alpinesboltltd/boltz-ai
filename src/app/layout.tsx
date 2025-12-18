import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/ToastProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Level-X |Level 4 Autonomous Digital Employees",
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
              window.LEVEL_X_CONFIG = {
                id: "9e0c8d37-5520-4a16-903a-49dd0a30fa30",
              };
            `,
          }}
        />
        <script src="http://192.168.1.162:3000/widget.js" async />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans w-full overflow-x-hidden">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
