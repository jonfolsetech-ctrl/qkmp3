
import React from 'react'

export default function PreviewPane({ data, title }) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        {data?.audio_url && (
          <audio controls src={data.audio_url} className="ml-4">
            Your browser does not support audio.
          </audio>
        )}
      </div>
      <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded-lg">
        {JSON.stringify(data, null, 2)}
      </pre>
      {data?.sheet_music_pdf_url && (
        <a href={data.sheet_music_pdf_url} target="_blank" rel="noreferrer" className="text-blue-600 underline mt-2 inline-block">
          View Sheet Music (PDF)
        </a>
      )}
    </div>
  )
}
