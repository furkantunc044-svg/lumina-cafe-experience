import LivePanel from "@/components/panel/LivePanel";
import { getVenueBySlug } from "@/lib/demo-data";

export default async function VenuePanelPage({
  params,
}: {
  params: Promise<{ venueSlug: string }>;
}) {
  const { venueSlug } = await params;
  const venue = getVenueBySlug(venueSlug);

  return <LivePanel venue={venue} />;
}
