import type { Metadata } from "next";
import "./globals.css";
import "./overrides.css";

export const metadata: Metadata = {
  title: { default: "AfriGate AI — Build investable African ventures", template: "%s | AfriGate AI" },
  description: "Project, feasibility, finance, stakeholder and document management for African ventures.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
