import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = async ({ children }: Props) => {
  const token = (await cookies()).get("pallet_token"); // server component
  if (!token) {
    return redirect("/login");
  }
  return children;
};

export default ProtectedRoute;
