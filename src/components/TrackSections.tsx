'use client'

import MusicProvider from "@/contexts/MusicProvider";
import AudioPlayer from "./AudioPlayer";
import Playlist from "./Playlist";

export default function TrackSections({ songs }: any) {
  return (
    <MusicProvider>
        {
        songs && (
            <div className="w-full sm:w-2/3">
                <Playlist songs={songs} />
                <AudioPlayer songs={songs} songCount={songs ? songs.length : 0} />
            </div>
          )
        }
    </MusicProvider>
  )
}