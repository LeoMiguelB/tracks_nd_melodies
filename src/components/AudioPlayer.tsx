'use client'

import * as React from 'react';
import {
  MdPlayArrow,
  MdPause,
  MdSkipNext,
  MdSkipPrevious,
  MdVolumeUp,
  MdVolumeOff,
} from 'react-icons/md';
import { GiRabbit } from "react-icons/gi";
import { CgSpinner } from 'react-icons/cg';
import IconButton from './IconButton';
import AudioProgressBar from './AudioProgressBar';
import VolumeInput from './VolumeInput';
import { MusicContext } from '@/contexts/MusicProvider';
import { Database } from '@/types/database.types';

function formatDurationDisplay(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);

  const formatted = [min, sec].map((n) => (n < 10 ? '0' + n : n)).join(':');

  return formatted;
}

interface AudioPlayerProps {
  songCount: number;
  songs: Database["public"]["Tables"]["audio_tracks"]["Row"][];
}

export default function AudioPlayer({
  songs,
  songCount,
}: AudioPlayerProps) {

  const { audioRef, isReady, duration, setDuration, setIsPlaying, setIsReady, currentProgress, setCurrentProgress, setVolume, volume, isPlaying, togglePlayPause, handleMuteUnmute, handleVolumeChange, setCurrentSongIndex, currentSongIndex, playbackRate, handlePlaybackRateChange, changeSongIndex } = React.useContext(MusicContext)

  const currentSong = songs ? songs[currentSongIndex] : null

  const durationDisplay = formatDurationDisplay(duration);
  const elapsedDisplay = formatDurationDisplay(currentProgress);

  React.useEffect(() => {
    audioRef.current?.pause();

    const timeout = setTimeout(() => {
      audioRef.current?.play();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [currentSongIndex]);

  const handleNext = () => {
    changeSongIndex((i: number) => i + 1);
  };

  const handlePrev = () => {
    changeSongIndex((i: number) => i - 1);
  };


  return (
    <div className="sm:bg-white sm:bg-opacity-[0.05] rounded-md text-slate-400 p-4">
      {currentSong && (
        <audio
          // must include key in order re-render audio elem
          // https://stackoverflow.com/a/57235913/20809108
          key={currentSongIndex}
          ref={audioRef}
          preload="metadata"
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleNext}
          onCanPlay={(e) => {
            e.currentTarget.volume = volume;
            setIsReady(true);
          }}
          onTimeUpdate={(e) => {
            setCurrentProgress(e.currentTarget.currentTime);
          }}
          onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        >
          <source type="audio/mpeg" src={currentSong.src} />
        </audio>
      )}
      <AudioProgressBar
        duration={duration}
        currentProgress={currentProgress}
        onChange={(e) => {
          if (!audioRef.current) return;

          audioRef.current.currentTime = e.currentTarget.valueAsNumber;

          setCurrentProgress(e.currentTarget.valueAsNumber);
        }}
      />


      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-1">
          <p className="text-slate-300 font-bold">
            {currentSong?.title ?? 'Select a song'}
          </p>
          <p className="text-xs">{currentSong?.artist ?? 'No Artist'}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 items-center mt-4">
        <span className="text-xs">
          {elapsedDisplay} / {durationDisplay}
        </span>
        <div className="flex items-center gap-4 justify-self-center">
          <IconButton
            onClick={handlePrev}
            disabled={currentSongIndex === 0}
            aria-label="go to previous"
            intent="secondary"
          >
            <MdSkipPrevious size={24} />
          </IconButton>
          <IconButton
            disabled={!isReady}
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            size="lg"
          >
            {!isReady && currentSong ? (
              <CgSpinner size={24} className="animate-spin" />
            ) : isPlaying ? (
              <MdPause size={30} className='bg-foreground'/>
            ) : (
              <MdPlayArrow size={30} className='bg-foreground'/>
            )}
          </IconButton>
          <IconButton
            onClick={handleNext}
            disabled={currentSongIndex === songCount - 1}
            aria-label="go to next"
            intent="secondary"
          >
            <MdSkipNext size={24} />
          </IconButton>
        </div>
        
        <div className="flex flex-col justify-self-end gap-6 pr-4">
          <div className="flex sm:gap-2 items-center">
            <IconButton
              intent="secondary"
              size="sm"
              onClick={handleMuteUnmute}
              className="hidden sm:inline"
              aria-label={volume === 0 ? 'unmute' : 'mute'}
            >
              {volume === 0 ? (
                <MdVolumeOff size={20} />
              ) : (
                <MdVolumeUp size={20} />
              )}
            </IconButton>
            <VolumeInput volume={volume} onVolumeChange={handleVolumeChange} />
            <span className='w-6 hidden sm:inline'>
              {Math.floor(volume*100)}%
            </span>
          </div>

          <div className="flex sm:gap-2 items-center">
            <IconButton
              intent="secondary"
              size="sm"
              className="hidden sm:inline"
            >
              <GiRabbit size={20}/>
            </IconButton>
            <input
              aria-label="volume"
              name="volume"
              type="range"
              min={0.6}
              step={0.01}
              max={1.5}
              value={playbackRate}
              // mobile users don't really use in built volume controls rather they use the phones volume controls
              className="hidden sm:inline w-[70px] sm:w-[90px] m-0 h-2 rounded-full accent-[background] bg-gray-700 appearance-none cursor-pointer"
              onChange={(e) => {
                handlePlaybackRateChange(e.currentTarget.valueAsNumber);
              }}
            />
            <span className='w-24 hidden sm:inline'>
              {currentSong && Math.floor(playbackRate * currentSong!.bpm!)} BPM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

