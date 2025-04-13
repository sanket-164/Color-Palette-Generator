"use client";

import React, { ReactNode } from "react";
import { ThemeType } from "@/lib/types";

interface ThemeContainerProps {
  theme: ThemeType;
  children: ReactNode;
}

const ThemeContainer: React.FC<ThemeContainerProps> = ({ theme, children }) => {
  // Create CSS variables for the theme
  const themeStyles = {
    "--theme-background": theme.background_color,
    "--theme-foreground": theme.text_color,
    "--theme-primary": theme.primary_color,
    "--theme-primary-foreground": "#ffffff", // Assuming white text on primary color
    "--theme-secondary": theme.secondary_color,
    "--theme-secondary-foreground": "#ffffff", // Assuming white text on secondary color
    "--theme-card": theme.surface_color,
    "--theme-card-foreground": theme.text_color,
    "--theme-border": `${theme.text_color}20`, // 20% opacity for border
    "--theme-input": `${theme.text_color}20`, // 20% opacity for input
    "--theme-muted": `${theme.background_color}CC`, // Slightly lighter for muted backgrounds
    "--theme-muted-foreground": `${theme.text_color}99`, // Muted text color
    "--theme-accent": theme.secondary_color,
    "--theme-accent-foreground": "#ffffff", // Assuming white text on accent color
    "--theme-ring": theme.primary_color,
  } as React.CSSProperties;

  return (
    <div className="theme-container" style={themeStyles}>
      {children}
    </div>
  );
};

export default ThemeContainer;
