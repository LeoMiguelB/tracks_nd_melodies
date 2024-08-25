'use server'

import React from 'react'
import TrackSections from "@/components/TrackSections"
import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'

// revalidate every 2 hrs
const get_cached_tracks = unstable_cache(
  async () => supabase
  .from('audio_tracks')
  .select()
, ['cached-audio-tracks'], {revalidate: 7200})

export default async function Home()  {

  const {data, error } = await get_cached_tracks()

  const songs = error ? null : data

  return (
    <main className="flex flex-col items-center justify-between pt-10">
      <TrackSections songs={songs} />
    </main>
  );
}

