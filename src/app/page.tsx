'use server'

import React from 'react'
import TrackSections from "@/components/TrackSections"
import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'

// revalidate every 10mins
const get_cached_tracks = unstable_cache(
  async () => supabase
  .from('audio_tracks')
  .select()
  , ['cached-audio-tracks'], {revalidate: 600})
  
export default async function Home()  {
  const {data, error } = await get_cached_tracks()

  return (
    error ?
    (
      <div>something went wrong</div>
    )
    :
    (
      <main className="flex flex-col items-center justify-between pt-10 w-full h-[660px] sm:h-[760px] sm:bg-white sm:bg-opacity-[0.05]">
        <TrackSections songs={data} />
      </main>
    )
  );
}

