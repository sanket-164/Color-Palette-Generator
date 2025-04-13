import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { cookies } from "next/headers";

const Navbar = async () => {
  const token = (await cookies()).get("pallet_token"); // server component
  return (
    <nav className="py-4 px-2 shadow-md w-full">
      <div className="w-full flex items-center justify-between">
        {/* left side */}
        <h1 className="text-2xl font-extrabold">ThemeFI</h1>
        {/* right side */}
        <div className="flex items-center gap-2">
          <Button variant="link">
            <Link href={`/${token ? "logout" : "login"}`}>
              {token ? "Logout" : "Login"}
            </Link>
          </Button>
          <Button variant="link">
            <Link href="/profile">Profile</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
