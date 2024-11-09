'use client'
import * as React from 'react'
import { MusicContext } from '@/contexts/MusicProvider';
import { Play, Pause, Download } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import Image from 'next/image';

interface PlaylistProps {
    songs: Array<any>
}

function WaveformDisplay({ url, isPlaying, isCurrentSong, progress = 0, duration }:
  {url: string, isPlaying: boolean, isCurrentSong: boolean, progress: number, duration: number}
) {
  const waveformRef = React.useRef<HTMLDivElement>(null);
  const wavesurfer = React.useRef<WaveSurfer | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const initializeWaveform = async () => {
      if (!waveformRef.current || wavesurfer.current) return;

      try {
        // Create placeholder waveform while loading
        const ws = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: '#4a5568',
          progressColor: '#9f7aea',
          cursorColor: 'transparent',
          barWidth: 2,
          barGap: 1,
          height: 32,
          normalize: true,
          interact: false,
          // Add loading indicator
          backend: 'WebAudio',
          renderFunction: (channels, ctx) => {
            if (!isLoaded) {
              // Draw loading placeholder
              const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
              gradient.addColorStop(0, '#4a5568');
              gradient.addColorStop(1, '#2d3748');
              ctx.fillStyle = gradient;
              
              // Create a simple placeholder visualization
              const height = ctx.canvas.height;
              for (let i = 0; i < ctx.canvas.width; i += 3) {
                const h = Math.random() * (height / 2);
                ctx.fillRect(i, height/2 - h/2, 2, h);
              }
            }
          }
        });

        wavesurfer.current = ws;

        // Handle successful load
        ws.on('ready', () => {
          if (mounted) {
            setIsLoaded(true);
            setLoadError(false);
          }
        });

        // Handle load errors
        ws.on('error', () => {
          if (mounted) {
            setLoadError(true);
            setIsLoaded(false);
          }
        });

        await ws.load(url);
      } catch (error) {
        console.error('Waveform loading error:', error);
        if (mounted) {
          setLoadError(true);
          setIsLoaded(false);
        }
      }
    };

    initializeWaveform();

    return () => {
      mounted = false;
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, isLoaded]);

  React.useEffect(() => {
    if (wavesurfer.current && isLoaded && !loadError) {
      wavesurfer.current.setTime(progress);
    }
  }, [progress, isLoaded, loadError]);

  if (loadError) {
    return (
      <div className="h-8 w-full bg-zinc-800/50 rounded flex items-center justify-center">
        <span className="text-xs text-gray-400">Waveform unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2">
      <div 
        ref={waveformRef} 
        className={`flex-1 transition-opacity duration-200 ${
          isCurrentSong ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'
        }`}
      />
      {isCurrentSong && (
        <span className="flex-none text-xs text-gray-400 ml-2">
          {formatTime(progress)}/{formatTime(duration)}
        </span>
      )}
    </div>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function Playlist({ songs }: PlaylistProps) {
  const { 
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
                    src="sample_pic.jfif" 
                    alt="Track artwork" 
                    className="w-full h-full object-cover"
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
                  progress={isCurrentSong ? currentProgress : 0}
                  duration={duration}
                />
              </div>

              <div className="flex-none flex items-center gap-2">
                {song.bpm && (
                  <span className="px-2 py-1 text-xs font-medium bg-zinc-800 rounded text-gray-300">
                    {song.bpm} BPM
                  </span>
                )}
                {song.midi && (
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
                    window.open(song.dl, '_blank');
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