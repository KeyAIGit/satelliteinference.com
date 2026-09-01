import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://satelliteinference.com"),
  alternates: { canonical: "/" },
  title: {
    default: "Satellite Inference | Orbital Computing Infrastructure",
    template: "%s | Satellite Inference",
  },
  description:
    "Scalable in-orbit processing for spacecraft, constellations, and autonomous systems, from hosted payloads to megawatt-class orbital networks.",
  applicationName: "Satellite Inference",
  authors: [{ name: "RFID INC" }],
  keywords: [
    "orbital computing",
    "space infrastructure",
    "satellite inference",
    "on-orbit processing",
    "edge computing",
    "spacecraft autonomy",
  ],
  openGraph: {
    type: "website",
    url: "https://satelliteinference.com",
    siteName: "Satellite Inference",
    title: "Satellite Inference | Orbital Computing Infrastructure",
    description: "Compute where space data begins.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Satellite Inference orbital computing infrastructure" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Satellite Inference | Orbital Computing Infrastructure",
    description: "Compute where space data begins.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "./favicon.svg",
    shortcut: "./favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06111f",
  colorScheme: "dark light",
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
