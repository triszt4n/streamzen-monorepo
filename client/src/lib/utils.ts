import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function badgeVariantForField(fieldName: "state" | "availability", value: string) {
  switch (fieldName) {
    case "availability":
      switch (value) {
        case "PUBLISHED":
          return "default"
        case "UNLISTED":
          return "secondary"
        default:
          return "outline"
      }
    case "state":
      switch (value) {
        case "PROCESSED":
          return "default"
        case "PROCESSING":
          return "secondary"
        case "FAILED":
          return "destructive"
        default:
          return "outline"
      }
  }
}

export function formatDateTime(dateTime: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Date(dateTime).toLocaleString("hu-HU", options)
}

export function translateField(fieldName: "state" | "availability", value: string) {
  switch (fieldName) {
    case "state":
      switch (value) {
        case "UNPROCESSED":
          return "Never started"
        case "PROCESSING":
          return "Processing"
        case "FAILED":
          return "Failed"
        case "UPLOADED":
          return "Uploaded"
        default:
          return "Streamable"
      }
    case "availability":
      return value[0].toUpperCase() + value.slice(1).toLowerCase()
  }
}
