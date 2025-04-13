import React from "react";
import { z } from "zod";

import { EditThemeFormSchema } from "@/lib/formSchemas";
import Modal from ".";
import ComponentPreview from "../ComponentPreview";

type Props = {
  theme: z.infer<typeof EditThemeFormSchema>;
};

const ThemePreviewModal = ({ theme }: Props) => {
  return (
    <Modal type={`theme-preview-${theme.theme_id}`}>
      <div>
        <ComponentPreview />
      </div>
    </Modal>
  );
};

export default ThemePreviewModal;
