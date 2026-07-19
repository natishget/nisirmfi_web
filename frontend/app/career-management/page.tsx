import CareerManagementClient from "@/components/career-management/career-management-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CareerManagementPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? "";

  const backendUrl = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
  const response = await fetch(`${backendUrl}/career`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      redirect("/admin-l09in");
    }
    throw new Error("Failed to load careers");
  }

  const items = await response.json();

  return (
    <CareerManagementClient
      initialCareers={items.map((career: any) => ({
        ...career,
        postDate: career.postDate,
        endDate: career.endDate,
      }))}
    />
  );
}
