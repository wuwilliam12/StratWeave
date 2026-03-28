import { notFound } from "next/navigation";
import { fetchBag, fetchBagItemsByBag, type Bag, type BoxingBagItem } from "@/lib/api";
import BagManager from "@/features/bag/components/BagManager";

interface BagPageProps {
  params: Promise<{ bagId: string }>;
}

export default async function BagPage({ params }: BagPageProps) {
  const { bagId } = await params;

  let bag: Bag;
  let items: BoxingBagItem[];

  try {
    [bag, items] = await Promise.all([
      fetchBag(bagId),
      fetchBagItemsByBag(bagId),
    ]);
  } catch (error) {
    notFound();
  }

  return (
    <main className="min-h-dvh p-6 sm:p-10">
      <BagManager bag={bag} initialItems={items} />
    </main>
  );
}