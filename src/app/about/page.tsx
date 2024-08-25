'use server'



export default async function Page()  {
  return (
    <main className="flex flex-col items-center justify-between pt-10">
      <div className="p-24">
        <p>This is a centralized place for all my melodies and things alike.</p>
        <br/>
        <p>Thank you for visiting!</p>
        <br/>
        <p>**NOTE: Downloaded file is in .flac, which is equivalent to .wav in quality. The audio playback on website is mp3 with tuned bitrate that is low, hence the mediorcore audio quality.**</p>
      </div>
    </main>
  );
}

