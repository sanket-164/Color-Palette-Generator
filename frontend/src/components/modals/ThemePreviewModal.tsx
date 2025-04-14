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
        <ComponentPreview
          initialTheme={{
            background_color: theme.background_color,
            primary_color: theme.primary_color,
            secondary_color: theme.secondary_color,
            surface_color: theme.surface_color,
            text_color: theme.text_color,
            theme_id: Number(theme.theme_id),
          }}
        />
      </div>
    </Modal>
  );
};

export default ThemePreviewModal;
