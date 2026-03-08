import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import songs from "./songs.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fetchSongs() {
    return songs.filter(song => song.title != null)
}