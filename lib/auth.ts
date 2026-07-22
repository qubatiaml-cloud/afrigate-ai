import { cache } from "react";
import { redirect } from "next/navigation";
import type { Organization, Prisma, Profile, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type AuthContext = {
  userId: string;
  email: string;
  profile: Profile;
  organization: Organization;
  organizationId: string;
  role: UserRole;
};

async function resolveContext() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { organization: true },
  });

  return { user, profile };
}

export const requireOrganization = cache(async (): Promise<AuthContext> => {
  const current = await resolveContext();
  if (!current) redirect("/login");
  if (!current.profile?.organization) redirect("/onboarding");

  return {
    userId: current.user.id,
    email: current.user.email || current.profile.email,
    profile: current.profile,
    organization: current.profile.organization,
    organizationId: current.profile.organization.id,
    role: current.profile.role,
  };
});

export async function getApiContext(): Promise<AuthContext | null> {
  const current = await resolveContext();
  if (!current?.profile?.organization) return null;
  return {
    userId: current.user.id,
    email: current.user.email || current.profile.email,
    profile: current.profile,
    organization: current.profile.organization,
    organizationId: current.profile.organization.id,
    role: current.profile.role,
  };
}

export async function writeAuditLog(context: AuthContext, action: string, resource: string, resourceId: string, metadata?: Prisma.InputJsonObject) {
  await prisma.auditLog.create({
    data: {
      action,
      resource,
      resourceId,
      actorId: context.userId,
      organizationId: context.organizationId,
      metadata,
    },
  });
}
