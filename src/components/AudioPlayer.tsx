import React from 'react';
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
import { MusicContext } from '@/contexts/MusicProvider';
import { Database } from '@/types/database.types';

function formatDurationDisplay(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);
  return [min, sec].map((n) => (n < 10 ? '0' + n : n)).join(':');
}

interface AudioPlayerProps {
  songCount: number;
  songs: Database["public"]["Tables"]["audio_tracks"]["Row"][];
}

export default function AudioPlayer({
  songs,
  songCount,
}: AudioPlayerProps) {
  const { 
    audioRef, isReady, duration, setDuration, setIsPlaying, setIsReady,
    currentProgress, setCurrentProgress, setVolume, volume, isPlaying,
    togglePlayPause, handleMuteUnmute, handleVolumeChange, currentSongIndex,
    playbackRate, handlePlaybackRateChange, changeSongIndex 
  } = React.useContext(MusicContext);

  const currentSong = songs ? songs[currentSongIndex] : null;
  const durationDisplay = formatDurationDisplay(duration);
  const elapsedDisplay = formatDurationDisplay(currentProgress);

  React.useEffect(() => {
    audioRef.current?.pause();
    const timeout = setTimeout(() => {
      audioRef.current?.play();
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentSongIndex]);

  const handleNext = () => changeSongIndex((i: number) => i + 1);
  const handlePrev = () => changeSongIndex((i: number) => i - 1);

  return (
    <div className=" bg-opacity-95 text-white rounded-lg p-4 pt-10">
      {currentSong && (
        <audio
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
          onTimeUpdate={(e) => setCurrentProgress(e.currentTarget.currentTime)}
          onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        >
          <source type="audio/mpeg" src={currentSong.src} />
        </audio>
      )}

      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-400 min-w-[40px]">
            {elapsedDisplay}
          </span>
          <div className="relative w-full group">
            <div className="absolute w-full h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#9f7aea] transition-colors"
                style={{ width: `${(currentProgress / duration) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentProgress}
              onChange={(e) => {
                if (!audioRef.current) return;
                audioRef.current.currentTime = e.currentTarget.valueAsNumber;
                setCurrentProgress(e.currentTarget.valueAsNumber);
              }}
              className="absolute w-full h-1 opacity-0 cursor-pointer"
              style={{ margin: 0 }}
            />
          </div>
          <span className="text-xs text-gray-400 min-w-[40px]">
            {durationDisplay}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Left section - Song Info */}
          <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
            {currentSong?.coverUrl && (
              <img 
                src={currentSong.coverUrl} 
                alt={currentSong.title}
                className="h-14 w-14 rounded"
              />
            )}
            <div className="flex flex-col">
              <p className="text-sm font-medium truncate hover:underline cursor-pointer">
                {currentSong?.title ?? 'Select a song'}
              </p>
              <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">
                {currentSong?.artist ?? 'No Artist'}
              </p>
            </div>
          </div>

          {/* Center section - Controls */}
          <div className="flex items-center justify-center max-w-[45%] w-full">
            <div className="flex items-center gap-6">
              <IconButton
                onClick={handlePrev}
                disabled={currentSongIndex === 0}
                aria-label="Previous"
                intent="secondary"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MdSkipPrevious size={28} />
              </IconButton>
              <IconButton
                disabled={!isReady}
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
              >
                {!isReady && currentSong ? (
                  <CgSpinner size={24} className="animate-spin" />
                ) : isPlaying ? (
                  <MdPause size={24} />
                ) : (
                  <MdPlayArrow size={24} />
                )}
              </IconButton>
              <IconButton
                onClick={handleNext}
                disabled={currentSongIndex === songCount - 1}
                aria-label="Next"
                intent="secondary"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MdSkipNext size={28} />
              </IconButton>
            </div>
          </div>

          {/* Right section - Volume & Additional Controls */}
          <div className="flex items-center gap-4 w-[30%] min-w-[180px] justify-end">
            <div className="flex items-center gap-2">
              <IconButton
                intent="secondary"
                size="sm"
                onClick={handleMuteUnmute}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={volume === 0 ? 'unmute' : 'mute'}
              >
                {volume === 0 ? (
                  <MdVolumeOff size={20} />
                ) : (
                  <MdVolumeUp size={20} />
                )}
              </IconButton>
              <div className="relative group w-24">
                <div className="absolute w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white group-hover:bg-[#9f7aea] transition-colors"
                    style={{ width: `${volume * 100}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="absolute w-full h-1 opacity-0 cursor-pointer"
                  style={{ margin: 0 }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GiRabbit size={20} className="text-gray-400" />
              <div className="relative group w-24">
                <div className="absolute w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white group-hover:bg-[#9f7aea] transition-colors"
                    style={{ width: `${((playbackRate - 0.6) / 0.9) * 100}%` }}
                  />
                </div>
                <input
                  aria-label="playback-speed"
                  type="range"
                  min={0.6}
                  step={0.01}
                  max={1.5}
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRateChange(e.currentTarget.valueAsNumber)}
                  className="absolute w-full h-1 opacity-0 cursor-pointer"
                  style={{ margin: 0 }}
                />
              </div>
              <span className="text-xs text-gray-400 w-16">
                {currentSong && Math.floor(playbackRate * currentSong.bpm!)} BPM
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}