
import React, { useState } from 'react'
import LyricsForm from './components/LyricsForm.jsx'
import PreviewPane from './components/PreviewPane.jsx'
import RatingForm from './components/RatingForm.jsx'

export default function App() {
  const [preview, setPreview] = useState(null)
  const [finalSong, setFinalSong] = useState(null)

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">QuickMP3 — Lyrics → Song</h1>
      <p className="text-gray-600">Paste lyrics, choose style, preview the composition JSON, and render a final mp3 (stub).</p>

      <LyricsForm onPreview={setPreview} onFinal={setFinalSong} />

      {preview && <PreviewPane data={preview} title="Preview JSON" />}
      {finalSong && <PreviewPane data={finalSong} title="Final JSON" />}

      <RatingForm />
    </div>
  )
}
