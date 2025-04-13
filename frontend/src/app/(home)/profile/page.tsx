"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileGetterFns } from "@/lib/interactions/dataGetters";
import useLoader from "@/store/useLoader";
import { Button } from "@/components/ui/button";
import useModal from "@/store/useModal";
import UpdateProfileModal from "@/components/modals/UpdateProfileModal";
import EmptyState from "@/components/EmptyState";

const ProfilePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: ProfileGetterFns.getProfile,
  });
  const { setLoading } = useLoader();
  const { openModal } = useModal();
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  if (!data || !data.profile) {
    return <EmptyState title="No Profile Found" />;
  }
  return (
    <div className="my-10">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">Profile</CardTitle>
          <CardDescription>
            View and manage your personal details
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="flex items-center space-x-4 p-2 rounded-md bg-gray-50">
            <User className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-base">{data?.profile?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-2 rounded-md bg-gray-50">
            <Mail className="h-5 w-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base">{data?.profile?.email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => openModal("update-profile")}>
            Update Profile
          </Button>
        </CardFooter>
      </Card>
      <UpdateProfileModal profile={data?.profile} />
    </div>
  );
};

export default ProfilePage;
