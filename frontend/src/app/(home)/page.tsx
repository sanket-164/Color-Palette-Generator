"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import useModal from "@/store/useModal";
import { useQuery } from "@tanstack/react-query";
import { ThemeGetterFns } from "@/lib/interactions/dataGetters";
import ColorBox from "@/components/ColorBox";
import EmptyState from "@/components/EmptyState";

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["themes"],
    queryFn: ThemeGetterFns.getThemes,
  });
  const { openModal } = useModal();
  return (
    <main className="">
      <Button
        size="icon"
        variant="outline"
        onClick={() => openModal("create-theme")}
      >
        <Plus />
      </Button>

      {/* themes */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-40 bg-gray-200 animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      ) : (
        <>
          {data?.themes?.length === 0 && (
            <EmptyState
              title="No themes found"
              description="Create a new theme to get started"
            />
          )}
          <div className="grid grid-cols-4 gap-4 mt-4">
            {data?.themes?.map((theme) => (
              <ColorBox key={theme.theme_id} pallet={theme} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
