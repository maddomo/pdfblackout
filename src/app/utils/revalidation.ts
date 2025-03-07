import { onRevalidate } from "~/server/server-actions";
import { api } from "~/trpc/react";

/**
 * This function is used to revalidate the cache.
 * It is used in the `useRevalidation` hook.
 */

export function useRevalidation() {
  const utils = api.useUtils();
  return async (reload?: boolean) => {
    await utils.invalidate(undefined, { refetchType: "all" });
    await onRevalidate();
    if (reload) location.reload();
  };
}