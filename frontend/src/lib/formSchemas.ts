import { z } from "zod";

export const RegisterFormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(32, {
      message: "Password must be at most 32 characters.",
    }),
});

export const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(32, {
      message: "Password must be at most 32 characters.",
    }),
});

// image upload
export const CreateThemeFormSchema = z.object({
  images: z.array(
    z.instanceof(File).refine((file) => {
      return file.size < 2 * 1024 * 1024; // 2MB
    })
  ),
  compression: z.boolean().optional(),
});

export const EditThemeFormSchema = z.object({
  background_color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Invalid hex color code",
  }),
  primary_color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Invalid hex color code",
  }),
  secondary_color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Invalid hex color code",
  }),
  surface_color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Invalid hex color code",
  }),
  text_color: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Invalid hex color code",
  }),
  theme_id: z.union([z.string(), z.number()]),
});

export const UserInfoSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  id: z.union([z.string(), z.number()]),
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});
