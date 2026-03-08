import { Song } from "@/lib/sorter";
import songs from "@/public/songs.json";

export function fetchSongs(): Song[] {
    return songs.filter(song => song.title != null)
}