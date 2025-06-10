import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isTokenValid(token) {
  if (!token) return false;
  console.log("Checking token validity:", token);

  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    console.log(
      "Token expiration time:",
      new Date(exp * 1000).toLocaleString()
    );

    if (Date.now() >= exp * 1000) {
      console.log("Token is expired");
      return false;
    }
    console.log("Token is valid");
    return true;
  } catch (e) {
    return false;
  }
}
