import { requireOrganization } from "@/lib/auth";
import { hasPermission, type ResourceName } from "@/lib/permissions";
import { resourceDefinitions } from "@/lib/resource-definitions";
import { getResourceOptions, listResource } from "@/lib/resources";
import { ResourceManager } from "@/components/resource-manager";

export async function ResourcePage({ resource }: { resource: ResourceName }) {
  const context = await requireOrganization();
  const [rows, options] = await Promise.all([listResource(resource, context), getResourceOptions(context)]);
  const definition = structuredClone(resourceDefinitions[resource]);
  definition.fields = definition.fields.map((field) => field.optionSource ? { ...field, options: options[field.optionSource] } : field);
  return <ResourceManager definition={definition} rows={rows as Array<Record<string, unknown> & { id: string }>} canManage={hasPermission(context.role, "create", resource)} currency={context.organization.currency} />;
}
