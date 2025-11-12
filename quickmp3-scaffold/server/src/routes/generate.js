
import { Router } from "express";
import { nanoid } from "nanoid";
import { z } from "zod";
import { generateInstrumentalStem, synthesizeVocalFromMelody, mixAndMaster } from "../lib/stubs.js";

const router = Router();

const InputPromptSchema = z.object({
  lyrics: z.string().min(1),
  preferences: z.object({
    genre: z.string().optional(),
    mood: z.string().optional(),
    instrumentation: z.array(z.string()).optional(),
    key: z.string().optional(),
    tempo_bpm: z.number().min(40).max(200).optional(),
    allow_lyric_edits: z.boolean().optional()
  }).default({}),
  hints: z.record(z.any()).optional()
});

/**
 * Small helper: generate a basic pop-ish chorus hook and structure.
 * In production, delegate to your LLM (SongSmith) and enforce JSON.
 */
function mockSongJSON({ lyrics, preferences }) {
  const id = nanoid(6);
  const genre = preferences.genre || "pop";
  const mood = preferences.mood || "reflective";
  const key = preferences.key || (mood === "sad" ? "A minor" : "C major");
  const tempo = preferences.tempo_bpm || (genre === "hip-hop" ? 88 : 96);
  const timeSig = "4/4";

  const verseLines = lyrics.split(/\r?\n/).filter(Boolean).slice(0, 4);
  while (verseLines.length < 4) verseLines.push("...");

  return {
    metadata: {
      title: `Untitled-${id}`,
      genre, mood, key,
      tempo_bpm: tempo,
      time_signature: timeSig,
      duration_estimate_sec: 210
    },
    structure: [
      {
        section: "Verse 1",
        lyrics: verseLines,
        rhyme_scheme: "A A B B",
        syllable_counts: verseLines.map(l => l.trim().split(/\s+/).length)
      },
      {
        section: "Chorus",
        lyrics: [
          "Lift me above the humming night",
          "Teach my heart to burn with light",
          "Call me home and hold me tight",
          "Guide my steps until they’re right"
        ],
        rhyme_scheme: "A A A A",
        syllable_counts: [7, 8, 7, 8]
      },
      { section: "Verse 2", lyrics: ["(to be expanded)"] },
      { section: "Bridge", lyrics: ["(to be expanded)"] }
    ],
    melody: {
      description: "Stepwise with lift to 6 in chorus; comfortable vocal range.",
      musicxml_excerpt: "<score-partwise version=\"3.1\">...</score-partwise>",
      midi_events: [
        { time_beats: 0, pitch_midi: 60, dur_beats: 1, velocity: 90 },
        { time_beats: 1, pitch_midi: 62, dur_beats: 1, velocity: 90 },
        { time_beats: 2, pitch_midi: 64, dur_beats: 1, velocity: 90 },
        { time_beats: 3, pitch_midi: 67, dur_beats: 2, velocity: 95 }
      ]
    },
    harmony: {
      global_scale: key.includes("minor") ? key : key + " (Ionian)",
      progression_by_section: [
        {
          section: "Verse 1",
          bars: [{ chords: ["I", "vi", "IV", "V"], roman_in_key: true }],
          voicing_notes: "guide tones stepwise"
        },
        {
          section: "Chorus",
          bars: [{ chords: ["IV", "V", "vi", "I"], roman_in_key: true }],
          voicing_notes: "classic pop cadence"
        }
      ]
    },
    arrangement: {
      instrumentation: preferences.instrumentation || ["drums","bass","piano","pads","guitar"],
      groove_notes: "straight 8ths, gentle pocket",
      section_tempo_map: [],
      production_style: "modern pop ballad"
    },
    mix_plan: {
      stems: [
        { name: "drums", pan: 0, target_lufs: -18, notes: "tight kick, light plate" },
        { name: "bass", pan: 0, target_lufs: -21 },
        { name: "keys", pan: -15, target_lufs: -24 },
        { name: "pads", pan: 15, target_lufs: -25 }
      ],
      bus_fx: ["glue comp 1.5:1", "subtle tape"],
      mastering: { target_lufs_integrated: -10, ceiling_db: -1 }
    },
    render_hints: {
      preview_length_bars: 16,
      export_format: "mp3",
      include_sheet_music_pdf: true
    }
  };
}

router.post("/preview", async (req, res) => {
  try {
    const parse = InputPromptSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

    const song = mockSongJSON(parse.data);
    // Optionally, pre-generate an instrumental preview stub
    song.audio_url = "https://example.com/previews/preview.mp3";
    return res.json(song);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "preview_failed" });
  }
});

router.post("/final", async (req, res) => {
  try {
    const parse = InputPromptSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

    const song = mockSongJSON(parse.data);

    // STUB PIPELINE — replace with real providers
    const instrumental = await generateInstrumentalStem({
      key: song.metadata.key, tempo_bpm: song.metadata.tempo_bpm, genre: song.metadata.genre
    });
    const vocal = await synthesizeVocalFromMelody({
      musicxml: song.melody.musicxml_excerpt, voice: "default"
    });
    const mix = await mixAndMaster({
      stems: [instrumental.url, vocal.url],
      mix_plan: song.mix_plan,
      export_format: song.render_hints.export_format
    });

    song.audio_url = mix.url;
    song.sheet_music_pdf_url = "https://example.com/sheets/lead.pdf";
    return res.json(song);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "final_failed" });
  }
});

export default router;
