import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAssetPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  // Ensure path starts with / and remove trailing slash from basePath if present
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return `${cleanBase}${cleanPath}`;
}
