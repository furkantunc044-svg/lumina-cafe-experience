import SplitBillView from "@/components/customer/SplitBillView";
import { getVenueBySlug } from "@/lib/demo-data";

function parseTableNumber(tableSlug: string): number {
  const match = tableSlug.match(/\d+/);
  return match ? parseInt(match[0], 10) : 12;
}

export default async function AdisyonPage({
  params,
}: {
  params: Promise<{ venueSlug: string; tableSlug: string }>;
}) {
  const { venueSlug, tableSlug } = await params;
  const venue = getVenueBySlug(venueSlug);
  const tableNumber = parseTableNumber(tableSlug);

  return (
    <SplitBillView
      venue={venue}
      tableNumber={tableNumber}
      tableSlug={tableSlug}
    />
  );
}
