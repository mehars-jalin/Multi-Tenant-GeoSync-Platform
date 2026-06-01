export type Tenant = {
  id: string;
  slug: string;
  name: string;
};

/** In-memory mock Redis: subdomain slug -> tenant record */
const tenants = new Map<string, Tenant>([
  ["acme", { id: "tenant-acme", slug: "acme", name: "Acme Corp" }],
  ["beta", { id: "tenant-beta", slug: "beta", name: "Beta Inc" }],
]);

export function getTenantBySubdomain(subdomain: string): Tenant | null {
  return tenants.get(subdomain.toLowerCase()) ?? null;
}
