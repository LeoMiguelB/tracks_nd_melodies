'use client'
import * as React from 'react'
import { MusicContext } from '@/contexts/MusicProvider';
import { Play, Pause, Download } from 'lucide-react';
import Image from 'next/image';
import WaveformDisplay from './waveform';
import { Database } from '@/types/database.types';

interface PlaylistProps {
    songs: Array<Database["public"]["Tables"]["audio_tracks"]["Row"]>
}

export default function Playlist({ songs }: PlaylistProps) {
  const { 
    audioRef,
    isPlaying, 
    currentSongIndex, 
    changeSongIndex, 
    togglePlayPause,
    currentProgress,
    duration 
  } = React.useContext(MusicContext);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="space-y-2">
        {songs && songs.map((song, index) => {
          const isCurrentSong = index === currentSongIndex;
          const isCurrentlyPlaying = isCurrentSong && isPlaying;
          
          return (
            <div 
              key={index}
              onClick={() => changeSongIndex(index)}
              className={`
                group relative flex items-center gap-4 p-3 rounded-lg
                transition-colors duration-150 cursor-pointer
              `}
            >
              <div className="flex-none">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden">
                  <Image 
                    unoptimized
                    src="/sample_pic.jfif" 
                    alt="Track artwork" 
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if(currentSongIndex === index) {
                    togglePlayPause();
                    return;
                  }
                  changeSongIndex(index);
                }}
                className="flex-none p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={isCurrentlyPlaying ? "Pause song" : "Play song"}
              >
                {isCurrentlyPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>

              <div className="flex flex-col mb-1">
                <span className="font-medium text-white truncate">
                  {song.title}
                </span>
                <span className="text-sm text-gray-400 truncate">
                  {song.artist || 'Unknown Artist'}
                </span>
              </div>
              <div className='flex-1'>
                <WaveformDisplay 
                  url={song.src} 
                  isPlaying={isCurrentlyPlaying}
                  isCurrentSong={isCurrentSong}
                  // TODO: https://github.com/users/LeoMiguelB/projects/1?pane=issue&itemId=78171534 must do som preprocessing in the insertion date to get this right
                />
              </div>

              <div className="flex-none flex items-center gap-2">
                {song.bpm && (
                  <span className="px-2 py-1 text-xs font-medium bg-zinc-800 rounded text-gray-300">
                    {song.bpm} BPM
                  </span>
                )}
                {/* TODO https://github.com/users/LeoMiguelB/projects/1/views/1?pane=issue&itemId=87525829, disable for now */}
                {false && (
                  <span className="px-2 py-1 text-xs font-medium bg-zinc-800 rounded text-gray-300">
                    MIDI
                  </span>
                )}
                {song.key && (
                  <span className="px-2 py-1 text-xs font-medium bg-zinc-800 rounded text-gray-300">
                    {song.key}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(song.dl!, '_blank');
                  }}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Download song"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}