import BattleView from "@/components/battle";
import { Song } from "@/lib/sorter";
import { fetchSongs } from "@/lib/utils";
import Image from "next/image";


export default function Home() {
  const songs: Song[] = fetchSongs()

  return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Image src="/eurovision-logo-2026.png" alt="logo" width={600} height={150} className="mb-20" />
        <BattleView songs={songs} />
      </div>
  );
}
