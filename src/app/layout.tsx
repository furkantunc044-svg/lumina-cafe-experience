import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumina Coffee & Bistro | Akıllı Masa Deneyimi",
  description:
    "NFC & QR destekli, uygulama indirme gerektirmeyen yeni nesil kafe ve restoran deneyim platformu.",
};

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#0c0b0a] text-[#f5f2ed] antialiased selection:bg-[#d9a05b]/30 selection:text-[#f3c78a]">
        {children}
      </body>
    </html>
  );
}
