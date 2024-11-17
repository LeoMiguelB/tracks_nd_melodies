'use client'

import WaveSurfer from 'wavesurfer.js';
import * as React from 'react'
import { MusicContext } from '@/contexts/MusicProvider';

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function WaveformDisplay({ url, isPlaying, isCurrentSong }:
  {url: string, isPlaying: boolean, isCurrentSong: boolean }
) {
  const { 
    currentProgress,
    duration,
    setCurrentProgress
  } = React.useContext(MusicContext);

  const waveformRef = React.useRef<HTMLDivElement>(null);
  const wavesurfer = React.useRef<WaveSurfer | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const initializeWaveform = async () => {
      if (!waveformRef.current) return;

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
          // Add loading indicator
          backend: 'WebAudio',
          // TODO in order to enable the below field -> https://github.com/users/LeoMiguelB/projects/1/views/1?pane=issue&itemId=87526441          
          dragToSeek: false,
          interact: false,
        });

        wavesurfer.current = ws;
        
        // Handle successful load
        ws.on('ready', () => {
          if (mounted) {
            setIsLoaded(true);
            setLoadError(false);
            wavesurfer?.current?.setTime(0);
          }
        });
        
        // Handle load errors
        ws.on('error', (error) => {
          console.error(error);
          if (mounted) {
            setLoadError(true);
            setIsLoaded(false);
          }
        });
        
        // load the audio 
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

    // cleanup
    return () => {
      mounted = false;
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, []);

  React.useEffect(() => {
    if (isCurrentSong && wavesurfer.current && isLoaded && !loadError) {
      wavesurfer.current.setTime(currentProgress);
    }
  }, [currentProgress, isLoaded, loadError, isCurrentSong]);

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
        <span className="flex-none text-xs w-12 text-gray-400 ml-2">
          {formatTime(currentProgress)}/{formatTime(duration)}
        </span>
      )}
    </div>
  );
}