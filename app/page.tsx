import { headers } from "next/headers";
import Counter from "@/components/Counter";
import GeofenceChecker from "@/components/GeofenceChecker";

export default function HomePage() {
  const headersList = headers();
  const tenantId = headersList.get("x-tenant-id");
  const tenantSlug = headersList.get("x-tenant-slug");
  const tenantName = headersList.get("x-tenant-name");

  return (
    <main>
      <h1>GeoSync Platform Demo</h1>

      <section>
        <h2>1. Multi-tenant (middleware)</h2>
        <p>
          Tenant: <strong>{tenantName}</strong>
        </p>
        <p>Slug: {tenantSlug}</p>
        <p>ID (x-tenant-id): {tenantId}</p>
      </section>

      <section>
        <h2>2. PostGIS geofence</h2>
        <GeofenceChecker />
      </section>

      <section>
        <h2>3. Real-time counter (Socket.io)</h2>
        <Counter />
      </section>
    </main>
  );
}
