import BattleView from "@/components/battle";
import { Song } from "@/lib/sorter";
import Image from "next/image";
import { fetchSongs } from "./actions";


export default function Home() {
  const songs: Song[] = fetchSongs()

  return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Image src="/eurovision-logo-2026.png" alt="logo" width={600} height={150} className="mb-20 max-lg:hidden" />
        <BattleView songs={songs} />
      </div>
  );
}
