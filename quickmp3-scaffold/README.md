
# QuickMP3 — Lyrics → Song Generator (React + Express Scaffold)

This is a minimal scaffold for a lyrics-to-song generator with:
- **Client**: React (Vite) + Tailwind UI
- **Server**: Node/Express + Zod validation
- **Contracts**: JSON schema matching the SongSmith spec (metadata/structure/melody/harmony/arrangement/mix_plan/render_hints)
- **Endpoints**:
  - `POST /api/generate/preview` — preview JSON (short form)
  - `POST /api/generate/final` — full JSON + (stub) rendered MP3/WAV URL

> NOTE: Audio and sheet-music generation are **stubs**. Wire them to your providers (e.g., Suno/Mubert for instrumental, ElevenLabs/RVC for vocal synth, FFmpeg/Pydub for mixing, and a MusicXML engraver to PDF).

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Server
cd server
npm run dev

# 3) Client (in another terminal)
cd ../client
npm run dev

# Open the client URL printed by Vite (usually http://localhost:5173)
```

## Configure

Copy `.env.example` to `.env` under `server/` and set your keys:

```
PORT=8787
CORS_ORIGIN=http://localhost:5173

# Providers (add your real keys)
SUNO_API_KEY=
VOICE_API_KEY=
```

## Deployment

- **Client**: Deploy build output (`client/dist`) to Netlify, Vercel, or GitHub Pages.
- **Server**: Deploy to Render/Fly/EC2/Amplify Function/Cloud Run.
- Update `VITE_API_BASE` in `client/.env` to point at your server URL.

## Contracts

The server returns JSON shaped for a downstream render pipeline (instrumental → vocal synth → mix → master). See `server/src/schemas/songSchema.ts`.

