export const DEFAULT_SITE_URL = "https://rijadrajkic.com";

export const SOCIAL_LINKS = {
 github: "https://github.com/RijadRajkic",
 linkedin: "https://www.linkedin.com/in/rijad-rajkic",
 email: "rijadrajkic@gmail.com",
} as const;

export const CURRENTLY_BUILDING = "Inventory Management System";

function normalizeSiteUrl(value: string): string {
 const trimmed = value.trim();
 const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
 return withProtocol.replace(/\/+$/, "");
}

function getVercelPreviewUrl(): string | null {
 const previewHost = process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL;
 if (!previewHost) {
  return null;
 }

 return normalizeSiteUrl(previewHost);
}

export function isProductionEnvironment(): boolean {
 if (process.env.VERCEL_ENV) {
  return process.env.VERCEL_ENV === "production";
 }

 return process.env.NODE_ENV === "production";
}

export function getSiteUrl(): string {
 const configured = process.env.NEXT_PUBLIC_SITE_URL;

 if (configured) {
  return normalizeSiteUrl(configured);
 }

 if (process.env.VERCEL_ENV === "preview") {
  const previewUrl = getVercelPreviewUrl();
  if (previewUrl) {
   return previewUrl;
  }
 }

 if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  return normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
 }

 return DEFAULT_SITE_URL;
}
