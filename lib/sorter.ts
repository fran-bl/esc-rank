export type Song = {
    id: number;
    spotify_id: string | null;
    country: string;
    alpha_2: string;
    alpha_3: string;
    artist: string | null;
    title: string | null;
}

export type BattleResolver = (winner: Song) => void

export async function rankSongs(songs: Song[], battle: (a: Song, b: Song) => Promise<Song>) {
    const cache = new Map<string, Song["id"]>()

    return await sort(songs, cache, battle)
}

async function sort(list: Song[], cache: Map<string, Song["id"]>, battle: (a: Song, b: Song) => Promise<Song>): Promise<Song[]> {
    if (list.length <= 1) return list;

    const m = Math.floor(list.length / 2)
    const left = await sort(list.slice(0, m), cache, battle)
    const right = await sort(list.slice(m), cache, battle)

    return await merge(left, right, cache, battle)
}

async function merge(left: Song[], right: Song[], cache: Map<string, Song["id"]>, battle: (a: Song, b: Song) => Promise<Song>): Promise<Song[]> {
    const res: Song[] = []

    let i = 0
    let j = 0

    while (i < left.length && j < right.length) {
        const a = left[i]
        const b = right[j]

        const key = `${a.id}|${b.id}`
        const reverse = `${b.id}|${a.id}`

        let w

        if (cache.has(key)) {
            w = cache.get(key)! === a.id ? a : b
        } else if (cache.has(reverse)) {
            w = cache.get(reverse)! === a.id ? a : b
        } else {
            w = await battle(a, b)
        }

        cache.set(key, w.id)

        if (w === a) {
            res.push(a)
            i++
        } else {
            res.push(b)
            j++
        }
    }

    return [
        ...res,
        ...left.slice(i),
        ...right.slice(j)
    ]
}