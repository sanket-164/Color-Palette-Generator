import React, { useEffect } from "react";
import Modal from ".";
import { DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { ThemeType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EditThemeFormSchema } from "@/lib/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
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
import useModal from "@/store/useModal";
import { useMutation } from "@tanstack/react-query";
import { ThemeFns } from "@/lib/interactions/dataPosters";
import useLoader from "@/store/useLoader";
import { toast } from "sonner";
import useRevalidation from "@/store/useRevalidation";

type Props = {
  theme_id: string | number;
  theme: ThemeType;
};

const EditThemeModal = ({ theme_id, theme }: Props) => {
  const { closeModal } = useModal();
  const { isPending, mutate } = useMutation({
    mutationFn: ThemeFns.updateTheme,
  });
  const revalidate = useRevalidation();
  const form = useForm<z.infer<typeof EditThemeFormSchema>>({
    defaultValues: {
      ...theme,
    },
    resolver: zodResolver(EditThemeFormSchema),
  });
  const { setLoading } = useLoader();

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  function onSubmit(data: z.infer<typeof EditThemeFormSchema>) {
    mutate(data, {
      onSuccess: (data) => {
        if (data?.success) {
          toast.success("Theme updated successfully");
          revalidate(["themes"]);
          closeModal();
        } else {
          toast.error(data?.message || "An error occurred");
        }
      },
      onError: (err) => {
        toast.error(err.message || "An error occurred");
      },
    });
    console.log(data);
  }

  return (
    <Modal type={`edit-theme-${theme_id}`}>
      <DialogHeader>
        <DialogTitle>Edit theme - {theme_id}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="background_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Background color
                  <span
                    className="h-3 w-3 rounded-full border-2 border-gray-500"
                    style={{ backgroundColor: field.value }}
                  />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="primary_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Primary color
                  <span
                    className="h-3 w-3 rounded-full border-2 border-gray-500/30"
                    style={{ backgroundColor: field.value }}
                  />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondary_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Secondary color
                  <span
                    className="h-3 w-3 rounded-full border-2 border-gray-500"
                    style={{ backgroundColor: field.value }}
                  />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surface_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Surface color
                  <span
                    className="h-3 w-3 rounded-full border-2 border-gray-500"
                    style={{ backgroundColor: field.value }}
                  />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Text color
                  <span
                    className="h-3 w-3 rounded-full border-2 border-gray-500"
                    style={{ backgroundColor: field.value }}
                  />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => closeModal()}
            >
              Cancel
            </Button>
            <Button type="submit" className="ml-2 cursor-pointer">
              Save
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
};

export default EditThemeModal;
