"use server";

import { revalidatePath } from "next/cache";

export async function onRevalidate() {
  "use server";
  revalidatePath("/");
}