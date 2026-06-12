import UserManagementClient from "@/components/user-management/user-management-client";
import { listUsers } from "@/lib/services/user.service";

export default async function UserManagementPage() {
  const { items } = await listUsers({
    page: 1,
    limit: 1000,
  });

  return <UserManagementClient initialUsers={items} />;
}
