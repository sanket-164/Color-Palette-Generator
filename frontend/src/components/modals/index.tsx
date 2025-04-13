import { Dialog, DialogContent } from "@/components/ui/dialog";
import useModal, { ModalType } from "@/store/useModal";

type Props = {
  type: ModalType;
  children: React.ReactNode;
};

export default function Modal({ type, children }: Props) {
  const { isOpen, modalType, closeModal } = useModal();
  const modalOpen = modalType === type && isOpen;

  if (!modalOpen) return null;
  return (
    <Dialog onOpenChange={closeModal} open={modalOpen}>
      <DialogContent className="overflow-y-auto">{children}</DialogContent>
    </Dialog>
  );
}
