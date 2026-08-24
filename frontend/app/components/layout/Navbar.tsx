"use client";

import NavbarClient from "./NavbarClient";
import { useGetProtectedUserQuery } from "@/state/api/ApiSlice";

export default function Navbar() {
  const { isSuccess } = useGetProtectedUserQuery();

  return <NavbarClient isAuthenticated={isSuccess} />;
}
