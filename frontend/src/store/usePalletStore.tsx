import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { EditThemeFormSchema } from "@/lib/formSchemas";

type PalletType = z.infer<typeof EditThemeFormSchema>;

const defaultPallet: PalletType = {
  background_color: "#ffffff",
  primary_color: "#ffffff",
  secondary_color: "#000000",
  surface_color: "#000000",
  text_color: "#000000",
  theme_id: -1,
};

interface PalletStore {
  pallet: PalletType;
  setPallet: (pallet: PalletType) => void;
}

const usePalletStore = create<PalletStore>()(
  persist(
    (set) => ({
      pallet: defaultPallet,
      setPallet: (pallet: PalletType) => set({ pallet }),
    }),
    {
      name: "pallet-storage",
    }
  )
);
export default usePalletStore;
