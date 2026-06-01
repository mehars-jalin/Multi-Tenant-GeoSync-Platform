# Multi-Tenant GeoSync Platform Demo

A minimal Next.js 14 demo covering:

1. **Multi-tenant middleware** — subdomain from `Host`, lookup in an in-memory mock Redis store, `x-tenant-*` headers injected, 404 for unknown tenants
2. **PostGIS geofence** — `POST /api/geofence` with `{ lat, lng }`, `ST_Contains` via Prisma `$queryRaw`
3. **Real-time counter** — Socket.io on a custom Node server; increment in one tab updates another in under 500ms

## Prerequisites

- Node.js 18+
- Docker Desktop (for PostGIS)

## Setup

```bash
# Start PostGIS
docker compose up -d

# Install dependencies
npm install

# Environment
cp .env.example .env

# Apply migration (enables PostGIS extension)
npx prisma migrate deploy

# Run dev server (custom server + Socket.io)
npm run dev
```

Open **tenant URLs** (not bare `localhost`):

- http://acme.localhost:3000
- http://beta.localhost:3000

Modern browsers resolve `*.localhost` to `127.0.0.1`.

## Testing

### Multi-tenant middleware

| URL | Expected |
|-----|----------|
| http://acme.localhost:3000 | Acme Corp, `tenant-acme` |
| http://beta.localhost:3000 | Beta Inc, `tenant-beta` |
| http://foo.localhost:3000 | 404 Unknown tenant |
| http://localhost:3000 | 404 (no subdomain) |

### Geofence API

Hardcoded polygon: downtown SF rectangle.

**Inside** (default on page): `lat: 37.78`, `lng: -122.41`

**Outside**: `lat: 37.5`, `lng: -122.0`

```bash
curl -X POST http://acme.localhost:3000/api/geofence \
  -H "Content-Type: application/json" \
  -d "{\"lat\":37.78,\"lng\":-122.41}"
# {"inside":true,"lat":37.78,"lng":-122.41}

curl -X POST http://acme.localhost:3000/api/geofence \
  -H "Content-Type: application/json" \
  -d "{\"lat\":37.5,\"lng\":-122.0}"
# {"inside":false,"lat":37.5,"lng":-122.0}
```

### Socket.io counter

1. Open http://acme.localhost:3000 in two browser tabs
2. Click **Increment** in one tab
3. Counter updates in both tabs immediately

## Architecture notes

- **Custom server** (`server.ts`) is required for Socket.io; this project cannot deploy to Vercel as-is.
- **Mock Redis** is an in-process `Map` in `lib/tenant-store.ts`, not a real Redis instance.
- **Middleware** runs on Edge; tenant lookup must stay synchronous.
- Set `ROOT_DOMAIN` in `.env` for production-style hosts (e.g. `example.com`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Custom server + Next.js dev |
| `npm run build` | Production Next.js build |
| `npm start` | Production custom server |
