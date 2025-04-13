import { create } from "zustand";

export type ModalType =
  | "create-theme"
  | `edit-theme-${string}`
  | "update-profile"
  | `theme-preview-${string}`;

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
}

const useModal = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  openModal: (modalType) => set({ isOpen: true, modalType }),
  closeModal: () => set({ isOpen: false, modalType: null }),
}));

export default useModal;
