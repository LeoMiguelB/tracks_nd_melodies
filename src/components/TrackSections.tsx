'use client'

import MusicProvider from "@/contexts/MusicProvider";
import AudioPlayer from "./AudioPlayer";
import Playlist from "./Playlist";

export default function({ songs }: any) {

  
  // for testing pagination
  const duplicates = songs.flatMap(item =>
    Array.from({ length: 5 }, (_, i) => ({
      ...item,
      id: item.id + i + 1 // Incrementing ID for each copy
    }))
  );

  return (
    <MusicProvider>
        {
        songs && (
            <div className="lg:w-1/2 md:w-full w-full">
                <Playlist songs={duplicates} />
                <AudioPlayer songs={duplicates} songCount={duplicates ? duplicates.length : 0} />
            </div>
          )
        }
    </MusicProvider>
  )
}