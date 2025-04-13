"use client";

import useLoader from "@/store/useLoader";
import { twMerge } from "tailwind-merge";

export default function LoaderComponent() {
  const { isLoading } = useLoader();

  if (!isLoading) return null;
  return (
    <div className="flex w-screen h-screen fixed inset-0 items-center justify-center bg-black/70 backdrop-blur-sm z-[1000]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className={twMerge(
            "relative size-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"
          )}
        ></div>
      </div>
    </div>
  );
}
