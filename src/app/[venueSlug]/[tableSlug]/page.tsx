import BentoHome from "@/components/customer/BentoHome";
import { getVenueBySlug } from "@/lib/demo-data";

function parseTableNumber(tableSlug: string): number {
  const match = tableSlug.match(/\d+/);
  return match ? parseInt(match[0], 10) : 12;
}

export default async function CustomerTablePage({
  params,
}: {
  params: Promise<{ venueSlug: string; tableSlug: string }>;
}) {
  const { venueSlug, tableSlug } = await params;
  const venue = getVenueBySlug(venueSlug);
  const tableNumber = parseTableNumber(tableSlug);

  return (
    <BentoHome
      venue={venue}
      tableNumber={tableNumber}
      tableSlug={tableSlug}
    />
  );
}
