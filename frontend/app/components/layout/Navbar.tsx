import { cookies } from "next/headers";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  let isAuthenticated = false;

  if (token) {
    try {
      const backendUrl = (process.env.NEXT_PUBLIC_LOCAL_API || "http://localhost:3001/").trim().replace(/\/$/, "");
      const response = await fetch(`${backendUrl}/auth/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      if (response.ok) {
        isAuthenticated = true;
      }
    } catch (e) {
      console.error("Navbar auth check failed:", e);
      isAuthenticated = false;
    }
  }

  return <NavbarClient isAuthenticated={isAuthenticated} />;
}
