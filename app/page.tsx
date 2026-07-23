import type { Metadata } from "next";
import CorporateSite from "./corporate-site";

export const metadata: Metadata = {
  title: "AfriGate — Investment, Industry, Trade & Logistics",
  description:
    "AfriGate connects investment, industry, trade and logistics opportunities across Africa and global markets.",
};

export default function HomePage() {
  return <CorporateSite />;
}
