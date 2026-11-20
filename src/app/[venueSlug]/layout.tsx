import { getVenueBySlug } from "@/lib/demo-data";

export default async function VenueLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ venueSlug: string }>;
}) {
  const { venueSlug } = await params;
  const venue = getVenueBySlug(venueSlug);

  return (
    <div
      style={
        {
          "--brand-primary": venue.primary_color,
          "--brand-accent": venue.accent_color,
        } as React.CSSProperties
      }
      className="min-h-screen bg-[#0c0b0a] text-[#f5f2ed]"
    >
      {children}
    </div>
  );
}
