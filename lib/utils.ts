// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: Create utils module
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// ROO-AUDIT-TAG :: plan-004-progress-tracking.md :: END