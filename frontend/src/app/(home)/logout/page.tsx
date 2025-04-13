"use client";

import cookies from "js-cookie";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  cookies.remove("pallet_token");
  const router = useRouter();
  router.push("/login");
  return null;
};

export default LogoutPage;
