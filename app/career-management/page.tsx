import { listCareers } from "@/lib/services/career.service";
import CareerManagementClient from "@/components/career-management/career-management-client";

export default async function CareerManagementPage() {
  const { items } = await listCareers({
    page: 1,
    limit: 1000,
    activeOnly: false,
  });

  return (
    <CareerManagementClient
      initialCareers={items.map((career) => ({
        ...career,
        postDate: career.postDate.toISOString(),
        endDate: career.endDate.toISOString(),
      }))}
    />
  );
}
