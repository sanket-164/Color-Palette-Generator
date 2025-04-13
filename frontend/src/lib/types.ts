export interface ThemeType {
  theme_id: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  primary_color: string;
  secondary_color: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  user_id?: string | number;
}
