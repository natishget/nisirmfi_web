import UserManagementClient from "@/components/user-management/user-management-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserManagementPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? "";

  const backendUrl = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
  const response = await fetch(`${backendUrl}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      redirect("/admin-l09in");
    }
    throw new Error("Failed to load users");
  }

  const items = await response.json();

  return <UserManagementClient initialUsers={items} />;
}
