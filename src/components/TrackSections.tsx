'use client'

import MusicProvider from "@/contexts/MusicProvider";
import AudioPlayer from "./AudioPlayer";
import Playlist from "./Playlist";

export default function TrackSections({ songs }: any) {
  return (
    <MusicProvider>
        {
        songs && (
            <div className="lg:w-1/2 md:w-full w-full">
                <Playlist songs={songs} />
                <AudioPlayer songs={songs} songCount={songs ? songs.length : 0} />
            </div>
          )
        }
    </MusicProvider>
  )
}