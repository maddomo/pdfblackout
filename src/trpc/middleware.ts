import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { type NextRequest } from "next/server";
import SuperJSON from "superjson";
import { type AppRouter } from "~/server/api/root";
import { getBaseUrl } from "~/app/utils/baseurl";

/**
 * This function only exists because NextJS Middleware is running in a special Vercel Runtime.
 * This means that some things like the Prisma Client are not supported in this runtime,
 * which means an HTTP request to the backend has to be made.
 */
export function createMiddlewareTRPCClient(req: NextRequest) {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        transformer: SuperJSON,
        url: getBaseUrl() + "/api/trpc",
        async headers() {
          const heads = new Map();
          heads.set("cookie", req.headers.get("cookie") ?? "");
          return heads;
        },
      }),
    ],
  });
}