import BagManager from "@/features/bag/components/BagManager";
import { fetchBag, fetchBagItemsByBag } from "@/lib/api";

export default async function BagPage() {
  // For now, hardcode the personal bag ID
  const bagId = "personal-bag";
  let bag, items;

  try {
    [bag, items] = await Promise.all([
      fetchBag(bagId),
      fetchBagItemsByBag(bagId),
    ]);
  } catch {
    // Fallback to old behavior if personal bag doesn't exist
    bag = undefined;
    items = undefined;
  }

  return (
    <main className="min-h-dvh p-6 sm:p-10">
      <BagManager bag={bag} initialItems={items} />
    </main>
  );
}
