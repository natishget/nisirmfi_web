import { notFound } from "next/navigation";

import CareerDetailView from "@/components/careers/career-detail-view";
import { listCareers, getCareerById } from "@/lib/services/career.service";
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

  const career = await getCareerById(parsedCareerId.data, {}).catch(() => null);

  if (!career) {
    notFound();
  }

  const related = await listCareers({
    page: 1,
    limit: 4,
    activeOnly: true,
  });

  return (
    <CareerDetailView
      career={{
        ...career,
        postDate: career.postDate.toISOString(),
        endDate: career.endDate.toISOString(),
      }}
      relatedCareers={related.items
        .filter((item: any) => item.id !== parsedCareerId.data)
        .map((item:any) => ({
          id: item.id,
          title: item.title,
          department: item.department,
          location: item.location,
        }))}
    />
  );
}
