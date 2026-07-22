"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { safeInternalPath } from "@/lib/security";

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  next: z.string().max(500).optional(),
});

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) redirect("/login?error=Enter%20a%20valid%20email%20and%20password.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) redirect("/login?error=Invalid%20email%20or%20password.");
  redirect(safeInternalPath(parsed.data.next));
}
