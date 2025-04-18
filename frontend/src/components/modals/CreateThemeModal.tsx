import React, { useEffect } from "react";
import { toast } from "sonner";

import Modal from ".";
import ImageUploader from "../FileUploader";
import { useMutation } from "@tanstack/react-query";
import { ThemeFns } from "@/lib/interactions/dataPosters";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import useModal from "@/store/useModal";
import useRevalidation from "@/store/useRevalidation";
import useLoader from "@/store/useLoader";

const CreateThemeModal = () => {
  const { closeModal } = useModal();
  const { mutate, isPending } = useMutation({
    mutationFn: ThemeFns.generateTheme,
  });
  const revalidate = useRevalidation();
  const { setLoading } = useLoader();
  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  function handleUpload(file: File[], compress: boolean) {
    mutate(
      {
        images: file,
        compression: compress,
      },
      {
        onSuccess: () => {
          toast.success("Theme generated successfully");
          closeModal();
          revalidate(["themes"]);
        },
        onError: (error) => {
          toast.error(error?.message || "Something went wrong");
        },
      }
    );
  }
  return (
    <Modal type="create-theme">
      <DialogHeader>
        <DialogTitle>Upload an image</DialogTitle>
      </DialogHeader>
      {isPending ? (
        <div className="flex justify-center items-center h-32">
          <div className="loader" />
        </div>
      ) : (
        <ImageUploader onSubmit={handleUpload} />
      )}
    </Modal>
  );
};

export default CreateThemeModal;
