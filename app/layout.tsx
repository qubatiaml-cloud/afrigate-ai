import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AfriGate AI — Trade without blind spots", template: "%s | AfriGate AI" },
  description: "AI-powered trade and logistics operations across Africa.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
