"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const onboardingSchema = z.object({
  organizationName: z.string().trim().min(2).max(120),
  fullName: z.string().trim().min(2).max(100),
  country: z.string().trim().min(2).max(80),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
});

export async function completeOnboarding(formData: FormData) {
  const parsed = onboardingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/onboarding?error=Complete%20all%20organization%20details.");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");
  const existingProfile = await prisma.profile.findUnique({ where: { id: user.id }, select: { organizationId: true } });
  if (existingProfile?.organizationId) redirect("/dashboard");

  const slugBase = parsed.data.organizationName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 45) || "organization";
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 6)}`;

  await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({ data: { name: parsed.data.organizationName, slug, country: parsed.data.country, currency: parsed.data.currency } });
    await tx.profile.upsert({
      where: { id: user.id },
      update: { fullName: parsed.data.fullName, organizationId: organization.id, role: "OWNER" },
      create: { id: user.id, email: user.email!, fullName: parsed.data.fullName, organizationId: organization.id, role: "OWNER" },
    });
  });

  redirect("/dashboard");
}
