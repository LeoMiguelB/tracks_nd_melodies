import { useState, useRef, ReactElement, createContext, Dispatch, SetStateAction, RefObject } from "react";

import * as React from 'react'

interface MusicContextType {
  audioRef: RefObject<HTMLAudioElement>;
  isReady: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;
  duration: number;
  setDuration: Dispatch<SetStateAction<number>>;
  currentProgress: number;
  setCurrentProgress: Dispatch<SetStateAction<number>>;
  buffered: number;
  setBuffered: Dispatch<SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  togglePlayPause: () => void;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  handleMuteUnmute: () => void;
  handleVolumeChange: (volumeValue: number) => void;
  currentSongIndex: number;
  setCurrentSongIndex: Dispatch<SetStateAction<number>>;
  changeSongIndex: (callback: any) => void;
  playbackRate: number;
  setPlaybackRate: Dispatch<SetStateAction<number>>;
  handlePlaybackRateChange: (volumeValue: number) => void;
}

// Create context with a default value
export const MusicContext = createContext<MusicContextType>({} as MusicContextType);

interface MusicProviderProps {
  children: ReactElement;
}


const PLAYBACK_DEFAULT = 1.0

export default function MusicProvider({ children }: MusicProviderProps): ReactElement {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.5);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = React.useState(-1);
  const [playbackRate, setPlaybackRate] = React.useState(PLAYBACK_DEFAULT);

  // saves volume state before mute
  const [localVolume, setLocalVolume] = useState(0.0)
  
  const togglePlayPause = (): void => {
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSongIndex = (callback: any) => {
    setCurrentSongIndex(callback);
    setPlaybackRate(PLAYBACK_DEFAULT);
  }
  

  const handleMuteUnmute = (): void => {
    if (!audioRef.current) {
      return
    }

    if (audioRef.current.volume === 0) {
      audioRef.current.volume = localVolume
    } else {
      setLocalVolume(audioRef.current.volume)
      audioRef.current.volume = 0
    }
  };

  const handleVolumeChange = (volumeValue: number): void => {
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
      setVolume(volumeValue);
    }
  };

  const handlePlaybackRateChange = (playbackRate: number): void => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      setPlaybackRate(playbackRate);
    }
  };

  const contextValue: MusicContextType = {
    audioRef,
    isReady,
    setIsReady,
    duration,
    setDuration,
    currentProgress,
    setCurrentProgress,
    buffered,
    setBuffered,
    volume,
    setVolume,
    isPlaying,
    setIsPlaying,
    togglePlayPause,
    handleMuteUnmute,
    handleVolumeChange,
    currentSongIndex,
    setCurrentSongIndex,
    playbackRate,
    setPlaybackRate,
    handlePlaybackRateChange,
    changeSongIndex
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
}