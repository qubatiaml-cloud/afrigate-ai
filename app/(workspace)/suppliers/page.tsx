import type { Metadata } from "next";
import { ResourcePage } from "@/components/resource-page";
export const metadata: Metadata = { title: "Suppliers" }; export const dynamic = "force-dynamic";
export default function Page() { return <ResourcePage resource="suppliers" />; }
