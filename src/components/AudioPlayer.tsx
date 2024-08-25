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
import { CgSpinner } from 'react-icons/cg';
import IconButton from './IconButton';
import AudioProgressBar from './AudioProgressBar';
import VolumeInput from './VolumeInput';
import { MusicContext } from '@/contexts/MusicProvider';

function formatDurationDisplay(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);

  const formatted = [min, sec].map((n) => (n < 10 ? '0' + n : n)).join(':');

  return formatted;
}

interface AudioPlayerProps {
  songCount: number;
  songs: Array<any>;
}

export default function AudioPlayer({
  songs,
  songCount,
}: AudioPlayerProps) {

  const { audioRef, isReady, duration, setDuration, setIsPlaying, setIsReady, currentProgress, setCurrentProgress, setVolume, volume, isPlaying, togglePlayPause, handleMuteUnmute, handleVolumeChange, setCurrentSongIndex, currentSongIndex, } = React.useContext(MusicContext)

  const currentSong = songs ? songs[currentSongIndex] : null

  console.log(currentSong)

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
    setCurrentSongIndex((i) => i + 1);
  };

  const handlePrev = () => {
    setCurrentSongIndex((i) => i - 1);
  };


  return (
    <div className="bg-[foreground] text-slate-400 p-3 relative">
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
      <div className="grid grid-cols-3 items-center mt-4">
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

        <div className="flex gap-3 items-center justify-self-end">
          <IconButton
            intent="secondary"
            size="sm"
            onClick={handleMuteUnmute}
            aria-label={volume === 0 ? 'unmute' : 'mute'}
          >
            {volume === 0 ? (
              <MdVolumeOff size={20} />
            ) : (
              <MdVolumeUp size={20} />
            )}
          </IconButton>
          <VolumeInput volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
      </div>
    </div>
  );
}

