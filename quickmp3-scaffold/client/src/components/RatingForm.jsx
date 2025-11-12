
import React, { useState } from 'react'

export default function RatingForm() {
  const [form, setForm] = useState({ hook: 4, mood: 4, range: 4, notes: '' })

  return (
    <div className="p-4 bg-white rounded-2xl shadow space-y-3">
      <h2 className="text-xl font-semibold">2) Rate the Preview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col text-sm">
          Chorus Hook (1–5)
          <input type="number" min="1" max="5" value={form.hook} onChange={e => setForm({ ...form, hook: Number(e.target.value) })} className="border rounded p-2" />
        </label>
        <label className="flex flex-col text-sm">
          Mood Match (1–5)
          <input type="number" min="1" max="5" value={form.mood} onChange={e => setForm({ ...form, mood: Number(e.target.value) })} className="border rounded p-2" />
        </label>
        <label className="flex flex-col text-sm">
          Vocal Range Comfort (1–5)
          <input type="number" min="1" max="5" value={form.range} onChange={e => setForm({ ...form, range: Number(e.target.value) })} className="border rounded p-2" />
        </label>
      </div>
      <label className="flex flex-col text-sm">
        What would you change?
        <textarea className="border rounded p-2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </label>
      <p className="text-xs text-gray-500">Persist and feed this back as <code>hints</code> in your next API call.</p>
    </div>
  )
}
