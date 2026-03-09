"use client";

import { rankSongs, Song } from "@/lib/sorter";
import { toPng } from "html-to-image";
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
    const rankingRef = useRef<HTMLDivElement>(null)

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

    async function saveImage() {
        if (!rankingRef.current) return

        const fontFamily = getComputedStyle(rankingRef.current).fontFamily.split(",")[0].trim()
        const fontRes = await fetch("/Singing_Sans.ttf")
        const fontBuf = await fontRes.arrayBuffer()
        const bytes = new Uint8Array(fontBuf)
        let binary = ""
        for (let i = 0; i < bytes.length; i += 8192) {
            binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
        }
        const fontEmbedCSS = `@font-face { font-family: ${fontFamily}; src: url('data:font/truetype;base64,${btoa(binary)}'); }`

        const { width, height } = rankingRef.current.getBoundingClientRect()
        const dataUrl = await toPng(rankingRef.current, { cacheBust: true, fontEmbedCSS, width, height })
        const link = document.createElement("a")
        link.download = "esc-2026-ranking.png"
        link.href = dataUrl
        link.click()
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
                    <h1 className="text-4xl max-sm:text-3xl w-1/2 max-sm:w-full text-center m-5">Welcome to ESC 2026 song sorter!</h1>
                    <Button onClick={start} variant="ghost" className="text-2xl font-thin text-white p-5 hover:cursor-pointer bg-black/40 backdrop-blur-md rounded-full">Start sorting</Button>
                </>
            )}
            {battle && (
                <>
                    <h1 className="text-3xl mt-10 max-sm:mt-0">Battle no. {battleCnt}:</h1>
                    <h2 className="text-xl text-zinc-500 mb-10 max-sm:mb-0">You are {pct}% done.</h2>
                    <div className="items-center justify-center grid grid-cols-2 max-lg:flex max-lg:flex-col gap-5 w-1/2 max-md:w-full m-5 hover:cursor-pointer">
                        <Card onClick={() => choose(battle[0])} className="pb-0 w-full active:scale-95 transition-transform bg-black/30 backdrop-blur-md border border-white/15 rounded-xl text-[#f3266a]">
                            <CardHeader className="flex flex-row items-center">
                                <Image src={`/hearts/Eurovision_2026_heart_-_${battle[0].country.replace(" ", "_")}.svg`} alt={battle[0].country} width={48} height={50} />
                                <p className="text-xl font-bold">{battle[0].country}</p>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-3xl font-bold">{battle[0].title}</p>
                                <p className="text-lg text-zinc-500">{battle[0].artist}</p>
                            </CardContent>
                            <div onClick={e => e.stopPropagation()} className="relative" style={{ height: 80 }}>
                                {battle[0].spotify_id && <>
                                    {!iframeLoaded[0] && <div className="absolute inset-0 z-10" />}
                                    <iframe
                                        src={`https://open.spotify.com/embed/track/${battle[0].spotify_id}?utm_source=generator`}
                                        width="100%"
                                        height="80"
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        onLoad={() => setIframeLoaded(prev => [true, prev[1]])}
                                    />
                                </>}
                            </div>
                        </Card>
                        <Card onClick={() => choose(battle[1])} className="pb-0 w-full active:scale-95 transition-transform bg-black/30 backdrop-blur-md border border-white/15 rounded-xl text-[#f3266a]">
                            <CardHeader className="flex flex-row items-center">
                                <Image src={`/hearts/Eurovision_2026_heart_-_${battle[1].country.replace(" ", "_")}.svg`} alt={battle[1].country} width={48} height={50} />
                                <p className="text-xl font-bold">{battle[1].country}</p>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-3xl font-bold">{battle[1].title}</p>
                                <p className="text-lg text-zinc-500">{battle[1].artist}</p>
                            </CardContent>
                            <div onClick={e => e.stopPropagation()} className="relative" style={{ height: 80 }}>
                                {battle[1].spotify_id && <>
                                    {!iframeLoaded[1] && <div className="absolute inset-0 z-10" />}
                                    <iframe
                                        src={`https://open.spotify.com/embed/track/${battle[1].spotify_id}?utm_source=generator`}
                                        width="100%"
                                        height="80"
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        onLoad={() => setIframeLoaded(prev => [prev[0], true])}
                                    />
                                </>}
                            </div>
                        </Card>
                    </div>
                </>
            )}
            {ranked && (
                <>
                    <h1 className="text-4xl max-sm:text-2xl w-1/2 max-sm:w-full text-center m-5">Your final ranking:</h1>
                    <div ref={rankingRef} className="flex flex-col gap-2">
                        {ranked.map((song, index) => {
                            const styles = [
                                "to-yellow-300/40",
                                "to-gray-300/40",
                                "to-orange-300/40"
                            ]

                            return (
                                <Card key={index} className={`flex flex-row px-5 py-2 items-center bg-linear-to-r from-black/40 ${styles[index] ? styles[index] : (index >= 3 && index < 10) ? "to-blue-400/40" : "to-black/40"} bg-opacity-40 backdrop-blur-md border border-white/15 rounded-xl text-[#f3266a]`}>
                                    <p className="text-3xl w-10 max-sm:w-7">{index + 1}.</p>
                                    <Image src={`/hearts/Eurovision_2026_heart_-_${song.country.replace(" ", "_")}.svg`} alt={song.country} width={48} height={50} />
                                    <p className="text-lg w-10 max-sm:hidden">{song.alpha_3}</p>
                                    <div className="flex flex-col">
                                        <p className="text-lg max-sm:text-md font-bold text-nowrap">{song.title}</p>
                                        <span className="text-sm max-sm:text-xs text-nowrap text-zinc-500">{song.artist}</span>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                    <Button onClick={saveImage} variant="ghost" className="my-4 text-2xl text-white p-5 hover:cursor-pointer bg-black/40 backdrop-blur-md rounded-full">Save as image</Button>
                </>
            )}
        </>
    );
}