/**
 * This function returns the base URL of the application.
 */

export function getBaseUrl() {
    if (process.env.VERCEL_ENV === "production") return "http://localhost:3000";
    if (typeof window !== "undefined") return window.location.origin;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }