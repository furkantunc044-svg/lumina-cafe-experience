import TipView from "@/components/customer/TipView";
import { getVenueBySlug } from "@/lib/demo-data";

function parseTableNumber(tableSlug: string): number {
  const match = tableSlug.match(/\d+/);
  return match ? parseInt(match[0], 10) : 12;
}

export default async function BahsisPage({
  params,
}: {
  params: Promise<{ venueSlug: string; tableSlug: string }>;
}) {
  const { venueSlug, tableSlug } = await params;
  const venue = getVenueBySlug(venueSlug);
  const tableNumber = parseTableNumber(tableSlug);

  return (
    <TipView venue={venue} tableNumber={tableNumber} tableSlug={tableSlug} />
  );
}
