import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/services/auth";
import { verifyAuthToken } from "@/utils/jwt";

import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  // Keep auth detection on the server so the shared shell stays lightweight.
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;

  let isAuthenticated = false;

  if (token) {
    try {
      await verifyAuthToken(token);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  return <NavbarClient isAuthenticated={isAuthenticated} />;
}
