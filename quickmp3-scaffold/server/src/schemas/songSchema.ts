
/**
 * JSON schema for SongSmith-compatible output (JS runtime via Zod).
 * Keep in sync with frontend types.
 */
import { z } from "zod";

export const SectionSchema = z.object({
  section: z.string(),
  lyrics: z.array(z.string()),
  rhyme_scheme: z.string().optional(),
  syllable_counts: z.array(z.number()).optional(),
});

export const MidiEventSchema = z.object({
  time_beats: z.number(),
  pitch_midi: z.number(),
  dur_beats: z.number(),
  velocity: z.number().optional()
});

export const SongSchema = z.object({
  metadata: z.object({
    title: z.string(),
    genre: z.string(),
    mood: z.string(),
    key: z.string(),
    tempo_bpm: z.number(),
    time_signature: z.string(),
    duration_estimate_sec: z.number(),
  }),
  structure: z.array(SectionSchema),
  melody: z.object({
    description: z.string(),
    musicxml_excerpt: z.string(),
    midi_events: z.array(MidiEventSchema)
  }),
  harmony: z.object({
    global_scale: z.string(),
    progression_by_section: z.array(z.object({
      section: z.string(),
      bars: z.array(z.object({
        chords: z.array(z.string()),
        roman_in_key: z.boolean().optional()
      })),
      voicing_notes: z.string().optional()
    }))
  }),
  arrangement: z.object({
    instrumentation: z.array(z.string()),
    groove_notes: z.string().optional(),
    section_tempo_map: z.array(z.object({
      section: z.string(),
      tempo_bpm: z.number()
    })).optional(),
    production_style: z.string().optional()
  }),
  mix_plan: z.object({
    stems: z.array(z.object({
      name: z.string(),
      pan: z.number(),
      target_lufs: z.number(),
      notes: z.string().optional()
    })),
    bus_fx: z.array(z.string()).optional(),
    mastering: z.object({
      target_lufs_integrated: z.number(),
      ceiling_db: z.number()
    })
  }),
  render_hints: z.object({
    preview_length_bars: z.number(),
    export_format: z.string(),
    include_sheet_music_pdf: z.boolean()
  }),
  // optional output URL from a downstream renderer
}).and(z.object({
  audio_url: z.string().url().optional(),
  sheet_music_pdf_url: z.string().url().optional()
}));

export type Song = z.infer<typeof SongSchema>;

export const InputPromptSchema = z.object({
  lyrics: z.string(),
  preferences: z.object({
    genre: z.string().optional(),
    mood: z.string().optional(),
    instrumentation: z.array(z.string()).optional(),
    key: z.string().optional(),
    tempo_bpm: z.number().optional(),
    allow_lyric_edits: z.boolean().optional()
  }),
  // optional hints from ratings
  hints: z.record(z.any()).optional()
});
