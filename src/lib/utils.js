import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isTokenValid(token) {
  if (!token) return false;

  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    if (Date.now() >= exp * 1000) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}
