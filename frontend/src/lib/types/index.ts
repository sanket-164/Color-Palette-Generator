export interface BaseResponse {
  message: string;
}

export type ThemeType = {
  background_color: string;
  primary_color: string;
  secondary_color: string;
  surface_color: string;
  text_color: string;
  theme_id: number;
  user_id: number;
};
