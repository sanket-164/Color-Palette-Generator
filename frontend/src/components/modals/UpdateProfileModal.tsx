import { z } from "zod";
import { useForm } from "react-hook-form";

import { UserInfoSchema } from "@/lib/formSchemas";
import Modal from ".";
import { DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import useModal from "@/store/useModal";
import { useMutation } from "@tanstack/react-query";
import { ProfileFns } from "@/lib/interactions/dataPosters";
import useLoader from "@/store/useLoader";
import { useEffect } from "react";
import { toast } from "sonner";
import useRevalidation from "@/store/useRevalidation";

type Props = {
  profile: z.infer<typeof UserInfoSchema>;
};

const UpdateProfileModal = ({ profile }: Props) => {
  const form = useForm<z.infer<typeof UserInfoSchema>>({
    defaultValues: {
      ...profile,
    },
    resolver: zodResolver(UserInfoSchema),
  });
  const { closeModal } = useModal();
  const { mutate, isPending } = useMutation({
    mutationFn: ProfileFns.updateProfile,
  });
  const { setLoading } = useLoader();
  const revalidate = useRevalidation();

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);
  function onSubmit(data: z.infer<typeof UserInfoSchema>) {
    mutate(data, {
      onSuccess(data) {
        if (data.success) {
          toast.success("Profile updated successfully");
          revalidate(["profile"]);
          closeModal();
        } else {
          toast.error(data.message);
        }
      },
      onError() {
        toast.error("Something went wrong");
      },
    });
  }

  return (
    <Modal type="update-profile">
      <DialogHeader>
        <DialogTitle>Update Profile</DialogTitle>
      </DialogHeader>
      {/* form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer">
              Update
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
};

export default UpdateProfileModal;
