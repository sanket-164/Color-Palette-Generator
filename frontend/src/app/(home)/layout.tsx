import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/providers/ProtectedRoute";

type Props = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="container mx-auto my-4">{children}</div>
    </ProtectedRoute>
  );
};

export default HomeLayout;
