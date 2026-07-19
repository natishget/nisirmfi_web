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

  const backendUrl = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
  
  const careerRes = await fetch(`${backendUrl}/career/${parsedCareerId.data}`, {
    cache: "no-store",
  });

  if (!careerRes.ok) {
    notFound();
  }

  const career = await careerRes.json();

  const relatedRes = await fetch(`${backendUrl}/career/active`, {
    cache: "no-store",
  });

  let relatedItems = [];
  if (relatedRes.ok) {
    relatedItems = await relatedRes.json();
  }

  return (
    <CareerDetailView
      career={{
        ...career,
        postDate: career.postDate,
        endDate: career.endDate,
      }}
      relatedCareers={relatedItems
        .filter((item: any) => item.id !== parsedCareerId.data)
        .slice(0, 4)
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          department: item.department,
          location: item.location,
        }))}
    />
  );
}
