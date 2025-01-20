import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function yearFromBirthYearAndTargetAge(
  birthYear: number,
  targetAge: number
): number {
  return birthYear + targetAge;
}
