'use client'

import * as React from 'react'
import { MusicContext } from '@/contexts/MusicProvider';
import { MdPause, MdPlayArrow } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";

interface PlaylistProps {
    songs: Array<any>
}

export default function Playlist({ songs }: PlaylistProps) {
  const { isPlaying, currentSongIndex, setCurrentSongIndex, togglePlayPause } = React.useContext(MusicContext)

  return (
    <div className="w-full max-w-md mx-auto h-[380px] sm:h-[500px] text-white overflow-x-auto">
      <table className="w-full sm:w-full border-collapse">
        <thead>
          <tr className="text-sm font-medium">
            <th className="hidden sm:block py-2 px-4 text-left">No.</th>
            <th className="py-2 px-4 text-left">Title</th>
            <th className="py-2 px-4 text-left">Key</th>
            <th className="py-2 px-4 text-right">BPM</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {songs && songs.map((song, index) => (
            <tr onClick={() => setCurrentSongIndex(index)} key={index} className="hover:bg-gray-800 transition-colors hover:cursor-pointer">
              <td className="hidden sm:block pt-9 py-6 px-4 font-medium text-sm">{index + 1 < 10 ? '0' + (index + 1) : index + 1}</td>
              <td className="py-6 px-4 font-medium truncate">{song.title}</td>
              <td className="py-6 px-4 text-sm">{song.key}</td>
              <td className="py-6 px-4 text-sm text-gray-400 text-right">{song.bpm}</td>
              <td className="py-6 px-2 text-center">
                <button 
                  onClick={() => window.open(song.dl, '_blank')}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                  aria-label="Download song"
                >
                  <IoMdDownload size={24}/>
                </button>
              </td>
              <td className="py-3 px-2 text-center">
                <button 
                  onClick={() => togglePlayPause()}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                  aria-label={index === currentSongIndex && isPlaying ? "Pause song" : "Play song"}
                >
                  {index === currentSongIndex && isPlaying ? (
                    <MdPause size={30} />
                  ) : (
                    <MdPlayArrow size={30} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

    // <ul className="pb-20 pt-8 h-[600px] border-white border-opacity-30  border-2 p-4">
    //   {songs && songs.map((song, index) => (
    //     <li key={song.title} className="mb-1">
    //       <button
    //         onClick={() => setCurrentSongIndex(index)}
    //         className={`flex items-center p-4 px-3 gap-16  w-full space-evenly rounded ${currentSongIndex === index
    //           ? 'bg-gray-700 text-white'
    //           : ' hover:bg-gray-900 hover:text-white'
    //           }`}
    //       >
    //         <span className="text-sm">
    //           {index + 1 < 10 ? '0' + (index + 1) : index + 1}
    //         </span>
    //         <h2 className="flex-1">{song.title}</h2>
    //         <h2 className="">152BPM</h2>
    //         <h2 className="">F Major</h2>
    //         <span className="flex gap-4 items-center justify-center">
    //           <a href={song.dl}>
    //             <IoMdDownload size={24}/>
    //           </a>
    //           {index === currentSongIndex && isPlaying ? (
    //             <MdPause size={30} onClick={togglePlayPause} />
    //           ) : (
    //             <MdPlayArrow size={30} onClick={togglePlayPause} />
    //           )}
    //         </span>
    //       </button>
    //     </li>
    //   ))}
    // </ul>
  )
}