import { NextRequest, NextResponse } from "next/server";
import { extractSubdomain } from "@/lib/subdomain";
import { getTenantBySubdomain } from "@/lib/tenant-store";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  const subdomain = extractSubdomain(request.headers.get("host"));
  if (!subdomain) {
    return new NextResponse("Unknown tenant", { status: 404 });
  }

  const tenant = getTenantBySubdomain(subdomain);
  if (!tenant) {
    return new NextResponse("Unknown tenant", { status: 404 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-tenant-id", tenant.id);
  requestHeaders.set("x-tenant-slug", tenant.slug);
  requestHeaders.set("x-tenant-name", tenant.name);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
