import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sifat Mahmud — Product Manager, Creative Technologist & Builder",
  description:
    "Interactive 3D portfolio showcasing product management, software projects, music, creative work, events, academics, and professional experience.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Sifat Mahmud — Product Manager, Creative Technologist & Builder",
    description:
      "Interactive 3D portfolio showcasing product management, software projects, music, creative work, events, academics, and professional experience.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
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
