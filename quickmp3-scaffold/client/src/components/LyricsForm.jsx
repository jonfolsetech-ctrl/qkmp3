
import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787'

export default function LyricsForm({ onPreview, onFinal }) {
  const [lyrics, setLyrics] = useState(`I walked the long road under neon rain
Hoping for a sign to call my name
Shadows on the glass keep drifting by
But I still dream beneath this city sky`)
  const [genre, setGenre] = useState('pop')
  const [mood, setMood] = useState('reflective')
  const [instrumentation, setInstrumentation] = useState('piano,pads,light drums')
  const [key, setKey] = useState('')
  const [tempo, setTempo] = useState('')

  async function callApi(endpoint) {
    const body = {
      lyrics,
      preferences: {
        genre,
        mood,
        instrumentation: instrumentation.split(',').map(s => s.trim()).filter(Boolean),
        key: key || undefined,
        tempo_bpm: tempo ? Number(tempo) : undefined,
        allow_lyric_edits: false
      }
    }
    const res = await fetch(`${API_BASE}/api/generate/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const e = await res.json().catch(() => ({}))
      throw new Error(e.error || 'request_failed')
    }
    return res.json()
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold">1) Enter Lyrics & Preferences</h2>

      <textarea
        className="w-full h-40 p-3 border rounded-lg"
        value={lyrics}
        onChange={e => setLyrics(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Genre</span>
          <select className="border rounded-lg p-2" value={genre} onChange={e => setGenre(e.target.value)}>
            <option>pop</option><option>rock</option><option>hip-hop</option><option>country</option><option>edm</option><option>rnb</option><option>lo-fi</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Mood</span>
          <select className="border rounded-lg p-2" value={mood} onChange={e => setMood(e.target.value)}>
            <option>happy</option><option>sad</option><option>energetic</option><option>calm</option><option>reflective</option><option>triumphant</option><option>tense</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Instrumentation (comma separated)</span>
          <input className="border rounded-lg p-2" value={instrumentation} onChange={e => setInstrumentation(e.target.value)} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Key (optional)</span>
          <input className="border rounded-lg p-2" placeholder="e.g., F major" value={key} onChange={e => setKey(e.target.value)} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Tempo BPM (optional)</span>
          <input className="border rounded-lg p-2" placeholder="e.g., 92" value={tempo} onChange={e => setTempo(e.target.value)} />
        </label>
      </div>

      <div className="flex gap-3">
        <button onClick={async () => onPreview(await callApi('preview'))} className="px-4 py-2 bg-black text-white rounded-xl">
          Generate Preview
        </button>
        <button onClick={async () => onFinal(await callApi('final'))} className="px-4 py-2 bg-gray-900 text-white rounded-xl">
          Finalize (stubbed MP3)
        </button>
      </div>
    </div>
  )
}
