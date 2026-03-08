"use client";

import { rankSongs, Song } from "@/lib/sorter";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

export default function BattleView({ songs }: { songs: Song[] }) {
    const [ranking, setRanking] = useState(false)
    const [ranked, setRanked] = useState<Song[] | null>(null)
    const [battle, setBattle] = useState<[Song, Song] | null>(null)
    const [battleCnt, setBattleCnt] = useState(0)
    const [pct, setPct] = useState(0)
    const [iframeLoaded, setIframeLoaded] = useState([false, false])
    const prevSpotifyIds = useRef<[string | null, string | null]>([null, null])
    const resolverRef = useRef<((song: Song) => void) | null>(null)

    useEffect(() => {
        if (!battle) return
        setIframeLoaded(prev => [
            battle[0].spotify_id === prevSpotifyIds.current[0] ? prev[0] : false,
            battle[1].spotify_id === prevSpotifyIds.current[1] ? prev[1] : false,
        ])
        prevSpotifyIds.current = [battle[0].spotify_id ?? null, battle[1].spotify_id ?? null]
    }, [battleCnt])

    const start = async () => {
        setRanking(true)
        const result = await rankSongs(songs, battlePromise)
        setRanked(result)
    }

    function battlePromise(a: Song, b: Song): Promise<Song> {
        setBattle([a, b])
        setBattleCnt(prev => {
            const next = prev + 1
            setPct(Math.min(100, Math.floor((next / (songs.length * Math.log2(songs.length))) * 100)))
            return next
        })

        return new Promise((resolve) => {
            resolverRef.current = resolve
        })
    }

    function choose(song: Song) {
        if (resolverRef.current) resolverRef.current(song)
        resolverRef.current = null
        setBattle(null)
    }

    return (
        <>
            {!ranking && (
                <>
                    <h1 className="text-4xl w-1/2 text-center m-5">Welcome to ESC 2026 favorite sorter!</h1>
                    <Button onClick={start} variant="ghost" className="text-3xl p-8 hover:cursor-pointer border-5 border-white rounded-2xl">Start sorting</Button>
                </>
            )}
            {battle && (
                <>
                    <h1 className="text-3xl mt-10">Battle no. {battleCnt}:</h1>
                    <h2 className="text-xl text-zinc-500 mb-10">You are {pct}% done.</h2>
                    <div className="items-center justify-center grid grid-cols-2 gap-5 w-1/2 hover:cursor-pointer">
                        <Card onClick={() => choose(battle[0])} className="pb-0 active:scale-95 transition-transform bg-black/30 backdrop-blur-md border border-white/15 rounded-xl">
                            <CardHeader className="flex flex-row items-center">
                                <Image src={`/hearts/Eurovision_2026_heart_-_${battle[0].country.replace(" ", "_")}.svg`} alt={battle[0].country} width={48} height={50} />
                                <p className="text-xl font-bold">{battle[0].country}</p>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-3xl font-bold">{battle[0].title}</p>
                                <p className="text-lg text-zinc-500">{battle[0].artist}</p>
                            </CardContent>
                            <div onClick={e => e.stopPropagation()} className="relative">
                                {!iframeLoaded[0] && <div className="absolute inset-0 z-10" />}
                                <iframe
                                    src={`https://open.spotify.com/embed/track/${battle[0].spotify_id}?utm_source=generator`}
                                    width="100%"
                                    height="152"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    onLoad={() => setIframeLoaded(prev => [true, prev[1]])}
                                />
                            </div>
                        </Card>
                        <Card onClick={() => choose(battle[1])} className="pb-0 active:scale-95 transition-transform bg-black/30 backdrop-blur-md border border-white/15 rounded-xl">
                            <CardHeader className="flex flex-row items-center">
                                <Image src={`/hearts/Eurovision_2026_heart_-_${battle[1].country.replace(" ", "_")}.svg`} alt={battle[1].country} width={48} height={50} />
                                <p className="text-xl font-bold">{battle[1].country}</p>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-3xl font-bold">{battle[1].title}</p>
                                <p className="text-lg text-zinc-500">{battle[1].artist}</p>
                            </CardContent>
                            <div onClick={e => e.stopPropagation()} className="relative">
                                {!iframeLoaded[1] && <div className="absolute inset-0 z-10" />}
                                <iframe
                                    src={`https://open.spotify.com/embed/track/${battle[1].spotify_id}?utm_source=generator`}
                                    width="100%"
                                    height="152"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    onLoad={() => setIframeLoaded(prev => [prev[0], true])}
                                />
                            </div>
                        </Card>
                    </div>
                </>
            )}
            {ranked && (
                <>
                    <h1 className="text-4xl w-1/2 text-center m-5">Your final ranking:</h1>
                    <div className="flex flex-col gap-2">
                        {ranked.map((song, index) => {
                            const styles = [
                                "bg-yellow-300/40",
                                "bg-gray-300/40",
                                "bg-orange-300/40"
                            ]

                            return (
                                <Card key={index} className={`flex flex-row px-5 py-2 items-center ${styles[index] ?? "bg-black/30"} backdrop-blur-md border border-white/15 rounded-xl`}>
                                    <p className="text-3xl w-10">{index + 1}.</p>
                                    <Image src={`/hearts/Eurovision_2026_heart_-_${song.country.replace(" ", "_")}.svg`} alt={song.country} width={48} height={50} />
                                    <p className="text-lg w-10">{song.alpha_3}</p>
                                    <div className="flex flex-col">
                                        <p className="text-lg font-bold">{song.title}</p>
                                        <span className={`text-sm ${styles[index] ? "text-gray-400" : "text-zinc-500"}`}>{song.artist}</span>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                </>
            )}
        </>
    );
}