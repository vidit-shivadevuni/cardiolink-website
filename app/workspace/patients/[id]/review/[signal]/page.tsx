import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewDetail } from "@/components/workspace/ReviewDetail";
import { FEATURED_PATIENT_ID, SIGNALS } from "@/lib/demo-data";

type Props = { params: Promise<{ id: string; signal: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { signal: signalId } = await params;
  const signal = SIGNALS.find((s) => s.id === signalId);
  return { title: `${signal?.title ?? "Review"} – Alex Morgan – CardioLink` };
}

export default async function ReviewPage({ params }: Props) {
  const { id, signal } = await params;
  const found = SIGNALS.find((s) => s.id === signal);
  if (id !== FEATURED_PATIENT_ID || !found) notFound();
  return <ReviewDetail signalId={found.id} />;
}
