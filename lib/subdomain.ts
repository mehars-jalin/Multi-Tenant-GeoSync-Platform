/**
 * Extract tenant subdomain from Host header.
 * - acme.localhost:3000 -> acme (ROOT_DOMAIN=localhost)
 * - acme.example.com -> acme (ROOT_DOMAIN=example.com)
 * - localhost / bare host -> null
 */
export function extractSubdomain(host: string | null): string | null {
  if (!host) return null;

  const hostname = host.split(":")[0].toLowerCase();
  const rootDomain = (process.env.ROOT_DOMAIN ?? "localhost").toLowerCase();

  if (hostname === rootDomain || hostname === "localhost") {
    return null;
  }

  if (hostname.endsWith(`.${rootDomain}`)) {
    const subdomain = hostname.slice(0, -(rootDomain.length + 1));
    if (!subdomain || subdomain.includes(".")) return null;
    return subdomain;
  }

  return null;
}
