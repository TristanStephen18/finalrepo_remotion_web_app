export type VoiceId =
  | '21m00Tcm4TlvDq8ikWAM'
  | '2EiwWnXFnvU5JabPnv8n'
  | 'CwhRBWXzGAHq8TQ4Fs17'
  | 'EXAVITQu4vr4xnSDxMaL'
  | 'Xb7hH8MSUJpSbSDYk0k2'
  | 'XrExE9yKIg1WjnnlVkGX'
  | 'TX3LPaxmHKxFdv7VOQHJ'
  | 'JBFqnCBsd6RMkjVDRZzb';


export type SampleVoice = 
  | 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/rachel.mp3'
  | 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/clyde.mp3'
  | 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/roger.mp3'
  | 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/sarah.mp3'
  | 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/alice.mp3'
  | 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/mathilda.mp3'
  | 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/liam.mp3'
  | 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/george.mp3';

export const VOICES: {id: VoiceId; label: string; sampleVoice: SampleVoice}[] = [
  {id: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel (Conversational, Friendly)', sampleVoice: 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/rachel.mp3'},
  {id: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde (Characters & Animation)',  sampleVoice: 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/clyde.mp3'},
  {id: 'CwhRBWXzGAHq8TQ4Fs17', label: 'Roger (Conversational)', sampleVoice: 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/roger.mp3'},
  {id: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah (Entertainment & TV)', sampleVoice: 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/sarah.mp3'},
  {id: 'Xb7hH8MSUJpSbSDYk0k2', label: 'Alice (Advertising)', sampleVoice: 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/alice.mp3'},
  {id: 'XrExE9yKIg1WjnnlVkGX', label: 'Mathilda (Informative & Educational)', sampleVoice: 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/mathilda.mp3'},
  {id: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam (Social Media & Vlogs)', sampleVoice: 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/liam.mp3'},
  {id: 'JBFqnCBsd6RMkjVDRZzb', label: 'George (Storytelling)', sampleVoice: 'https://rsnemknhybirnaxoffur.supabase.co/storage/v1/object/public/Remotion%20Web%20App%20file%20bucket/other_audios/george.mp3'},
];
