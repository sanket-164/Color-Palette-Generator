import { useQueryClient } from "@tanstack/react-query";

export default function useRevalidation() {
  const queryClient = useQueryClient();

  function revalidateKeys(keys: string[] | string | unknown[]) {
    (async function () {
      try {
        await Promise.all([
          queryClient.refetchQueries({
            queryKey: Array.isArray(keys) ? keys : [keys],
          }),
        ]);
      } catch (error) {
        console.error("Error refetching queries:", error);
        throw error;
      }
    })();
  }

  return revalidateKeys;
}
