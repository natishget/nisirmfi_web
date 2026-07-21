import { notFound } from "next/navigation";

import CareerDetailView from "@/components/careers/career-detail-view";
import { careerIdSchema } from "@/lib/validators/career";

export default async function CareerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedCareerId = careerIdSchema.safeParse(id);

  if (!parsedCareerId.success) {
    notFound();
  }

  const BASE_URL = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");

  const careerRes = await fetch(`${BASE_URL}/career/${parsedCareerId.data}`, { cache: "no-store" });
  if (!careerRes.ok) {
    notFound();
  }
  const career = await careerRes.json();

  const relatedRes = await fetch(`${BASE_URL}/career/active?page=1&limit=4`, { cache: "no-store" });
  let related = { data: [] };
  if (relatedRes.ok) {
    related = await relatedRes.json();
  }

  return (
    <CareerDetailView
      career={career}
      relatedCareers={(related.data || [])
        .filter((item: any) => item.id !== parsedCareerId.data)
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          department: item.department,
          location: item.location,
        }))}
    />
  );
}
