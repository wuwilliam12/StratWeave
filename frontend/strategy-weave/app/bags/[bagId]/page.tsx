import { notFound } from "next/navigation";
import { fetchBag, type Bag } from "@/lib/api";
import BagManager from "@/features/bag/components/BagManager";

interface BagPageProps {
  params: Promise<{ bagId: string }>;
}

export const dynamic = 'force-dynamic';

export default async function BagPage({ params }: BagPageProps) {
  const { bagId } = await params;

  let bag: Bag;

  try {
    bag = await fetchBag(bagId);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-dvh p-6 sm:p-10">
      <BagManager bag={bag} />
    </main>
  );
}