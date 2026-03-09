import BattleView from "@/components/battle";
import { Song } from "@/lib/sorter";
import Image from "next/image";
import { fetchSongs } from "./actions";


export default function Home() {
  const songs: Song[] = fetchSongs()

  return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Image src="/eurovision-logo-2026.png" alt="logo" width={0} height={0} sizes="50vw" className="w-1/2 h-auto mt-10 mb-5" />
        <BattleView songs={songs} />
      </div>
  );
}
