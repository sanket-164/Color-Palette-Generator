import axios from "axios";
import cookies from "js-cookie";

import { axiosInstance, TOKEN_COOKIE_KEY } from "../constants";
import { ThemeType } from "../types";
import { z } from "zod";
import { UserInfoSchema } from "../formSchemas";

export class ThemeGetterFns {
  static async getThemes() {
    try {
      const { data } = await axiosInstance.get("/user/theme", {
        headers: {
          Authorization: `Bearer ${cookies.get(TOKEN_COOKIE_KEY)}`,
        },
      });
      return {
        message: "Themes fetched successfully",
        success: true,
        themes: (data.themes ?? []) as ThemeType[],
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

export class ProfileGetterFns {
  static async getProfile() {
    try {
      const { data } = await axiosInstance.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${cookies.get(TOKEN_COOKIE_KEY)}`,
        },
      });
      return {
        message: "Profile fetched successfully",
        success: true,
        profile: data?.user as z.infer<typeof UserInfoSchema>,
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
