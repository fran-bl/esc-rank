import { Song } from "@/lib/sorter";

export async function fetchSongs(): Promise<Song[]> {
    const data = await fetch(`https://raw.githubusercontent.com/fran-bl/esc-song-data/refs/heads/main/songs.json?t=${Date.now()}`)
    const songs = await data.json()

    return songs.filter((song: Song) => song.title != null)
}