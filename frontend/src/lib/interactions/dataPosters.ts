import { z } from "zod";
import axios from "axios";

import cookies from "js-cookie";
import { axiosInstance, TOKEN_COOKIE_KEY } from "../constants";
import {
  CreateThemeFormSchema,
  EditThemeFormSchema,
  LoginFormSchema,
  RegisterFormSchema,
  UserInfoSchema,
} from "../formSchemas";
import { ThemeType } from "../types";

export class AuthFns {
  static async register(data: z.infer<typeof RegisterFormSchema>) {
    try {
      const response = await axiosInstance.post("/auth/register", data);
      console.log(response);
      return {
        message: response.data.message,
        success: true,
      };
    } catch (e: unknown) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        return {
          message: e.response?.data.error || "Something went wrong",
          success: false,
        };
      }
      return {
        message: "Something went wrong",
        success: false,
      };
    }
  }

  static async login(data_: z.infer<typeof LoginFormSchema>) {
    try {
      const { data } = await axiosInstance.post("/auth/login", data_);
      return {
        message: "Login successful",
        success: true,
        token: data.jwt_token,
      };
    } catch (e: unknown) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        return {
          message: e.response?.data.error || "Something went wrong",
          success: false,
        };
      }
      return {
        message: "Something went wrong",
        success: false,
      };
    }
  }
}

export class ThemeFns {
  static async generateTheme(data: z.infer<typeof CreateThemeFormSchema>) {
    try {
      const formData = new FormData();
      for (const file of data.images) {
        formData.append("images", file);
      }
      formData.append("compress", String(data.compression));
      const { data: resp } = await axiosInstance.post(
        "/user/generate-theme",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookies.get(TOKEN_COOKIE_KEY)}`,
          },
        }
      );
      return {
        message: "Theme generated successfully",
        success: true,
        theme: resp.theme as ThemeType,
      };
    } catch (e: unknown) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        return {
          message: e.response?.data.error || "Something went wrong",
          success: false,
        };
      }
      return {
        message: "Something went wrong",
        success: false,
      };
    }
  }

  static async deleteTheme(id: string | number) {
    try {
      const { status } = await axiosInstance.delete("/user/theme", {
        headers: {
          Authorization: `Bearer ${cookies.get(TOKEN_COOKIE_KEY)}`,
        },
        data: {
          theme_id: id,
        },
      });
      if (status === 200) {
        return {
          message: "Theme deleted successfully",
          success: true,
        };
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        return {
          message: e.response?.data.error || "Something went wrong",
          success: false,
        };
      }
      return {
        message: "Something went wrong",
        success: false,
      };
    }
  }

  static async updateTheme(data: z.infer<typeof EditThemeFormSchema>) {
    try {
      const { status } = await axiosInstance.patch("/user/theme", data, {
        headers: {
          Authorization: `Bearer ${cookies.get(TOKEN_COOKIE_KEY)}`,
        },
      });
      if (status === 200) {
        return {
          message: "Theme updated successfully",
          success: true,
        };
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        return {
          message: e.response?.data.error || "Something went wrong",
          success: false,
        };
      }
      return {
        message: "Something went wrong",
        success: false,
      };
    }
  }
}

export class ProfileFns {
  static async updateProfile(data: z.infer<typeof UserInfoSchema>) {
    try {
      const { status } = await axiosInstance.patch("/user/profile", data, {
        headers: {
          Authorization: `Bearer ${cookies.get(TOKEN_COOKIE_KEY)}`,
        },
      });
      if (status === 200) {
        return {
          message: "Profile updated successfully",
          success: true,
        };
      }
      return {
        message: "Something went wrong",
        success: false,
      };
    } catch (e: unknown) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        return {
          message: e.response?.data.error || "Something went wrong",
          success: false,
        };
      }
      return {
        message: "Something went wrong",
        success: false,
      };
    }
  }
}
