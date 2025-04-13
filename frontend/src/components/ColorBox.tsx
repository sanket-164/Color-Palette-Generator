"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle, Edit, Trash2, PaintBucket } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { ThemeType } from "@/lib/types";
import { ThemeFns } from "@/lib/interactions/dataPosters";
import { Button } from "./ui/button";
import useLoader from "@/store/useLoader";
import useRevalidation from "@/store/useRevalidation";
import EditThemeModal from "./modals/EditThemeModal";
import useModal from "@/store/useModal";
import ThemePreviewModal from "./modals/ThemePreviewModal";

interface ColorBoxProps {
  pallet: ThemeType;
}

interface ColorInfo {
  color: string;
  name: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ pallet }) => {
  const {
    background_color,
    primary_color,
    secondary_color,
    surface_color,
    text_color,
    theme_id,
  } = pallet;
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: ThemeFns.deleteTheme,
  });
  const { setLoading } = useLoader();
  const { openModal } = useModal();
  const revalidate = useRevalidation();

  useEffect(() => {
    setLoading(isPending);
  }, [isPending, setLoading]);

  const colors: ColorInfo[] = [
    { color: background_color, name: "Background" },
    { color: primary_color, name: "Primary" },
    { color: secondary_color, name: "Secondary" },
    { color: surface_color, name: "Surface" },
    { color: text_color, name: "Text" },
  ];

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const getTextColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 128 ? "#000000" : "#ffffff";
  };

  function handleDelete() {
    const flg = confirm(
      "Are you sure you want to delete this theme? This action cannot be undone."
    );
    if (!flg) return;
    mutate(theme_id, {
      onSuccess(data) {
        if (data?.success) {
          toast.success("Theme deleted successfully");
          revalidate(["themes"]);
        } else {
          toast.error(data?.message || "Something went wrong");
        }
      },
      onError(err) {
        toast.error(err.message || "Something went wrong");
      },
    });
  }

  return (
    <div className="px-3 mx-auto">
      <div
        className="p-6 rounded-xl shadow-lg"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Theme #{theme_id}</h2>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="text-green-500 hover:text-green-600 cursor-pointer"
                disabled={isPending}
                title="Preview Theme"
                onClick={() => openModal(`theme-preview-${theme_id}`)}
              >
                <PaintBucket size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
                onClick={() => openModal(`edit-theme-${theme_id}`)}
                disabled={isPending}
              >
                <Edit size={16} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-rose-500 hover:text-rose-600 cursor-pointer"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Click on any color to copy its hex code
          </p>
        </div>

        <div className="grid grid-cols-5 -gap-4">
          {colors.map(({ color, name }) => (
            <div
              key={name}
              onClick={() => copyToClipboard(color)}
              className="relative group cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:rotate-3"
            >
              <div
                className="h-24 sm:h-32 rounded-lg shadow-md w-[54px] overflow-hidden flex items-end"
                style={{ backgroundColor: color }}
              >
                <div
                  className="absolute inset-0 items-center justify-center text-xs font-medium transform rotate-90 hidden group-hover:flex transition duration-200"
                  style={{
                    color: getTextColor(color),
                  }}
                >
                  {name}
                  <br />
                  {color}
                </div>
              </div>

              {/* Copy indicator */}
              {copiedColor === color && (
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="bg-white rotate-90 rounded-md px-2 py-1 text-xs flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    <span>Copied!</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* modals */}
      <EditThemeModal theme_id={theme_id} theme={pallet} />
      <ThemePreviewModal theme={pallet} />
    </div>
  );
};

export default ColorBox;
