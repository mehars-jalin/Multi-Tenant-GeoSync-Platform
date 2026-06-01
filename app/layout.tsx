import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoSync Demo",
  description: "Multi-tenant geofence and real-time demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
