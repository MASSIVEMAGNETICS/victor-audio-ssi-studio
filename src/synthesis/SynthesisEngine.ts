import { SynthesisConfig } from '../config/StudioConfig';

/**
 * Oscillator types for synthesis
 */
export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'custom';

/**
 * Filter types for audio processing
 */
export type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch' | 'allpass';

/**
 * Synthesis Parameters
 */
export interface SynthesisParams {
  frequency: number;
  amplitude: number;
  oscillatorType: OscillatorType;
  filterType?: FilterType;
  filterCutoff?: number;
  filterResonance?: number;
}

/**
 * Voice State for polyphonic synthesis
 */
interface VoiceState {
  id: number;
  active: boolean;
  params: SynthesisParams;
  startTime: number;
}

/**
 * Next-Generation Synthesis Engine
 * Polyphonic synthesis with advanced DSP and AI integration
 */
export class SynthesisEngine {
  private config: SynthesisConfig;
  private voices: Map<number, VoiceState> = new Map();
  private nextVoiceId: number = 0;

  constructor(config: SynthesisConfig) {
    this.config = config;
  }

  /**
   * Start a synthesis voice
   */
  public startVoice(params: SynthesisParams): number {
    if (this.voices.size >= this.config.polyphony) {
      // Voice stealing: remove oldest voice
      this.stealOldestVoice();
    }

    const voiceId = this.nextVoiceId++;
    const voice: VoiceState = {
      id: voiceId,
      active: true,
      params,
      startTime: Date.now(),
    };

    this.voices.set(voiceId, voice);
    return voiceId;
  }

  /**
   * Stop a synthesis voice
   */
  public stopVoice(voiceId: number): void {
    const voice = this.voices.get(voiceId);
    if (voice) {
      voice.active = false;
      this.voices.delete(voiceId);
    }
  }

  /**
   * Update voice parameters in real-time
   */
  public updateVoice(voiceId: number, params: Partial<SynthesisParams>): void {
    const voice = this.voices.get(voiceId);
    if (voice && voice.active) {
      voice.params = { ...voice.params, ...params };
    }
  }

  /**
   * Synthesize audio buffer
   */
  public synthesize(durationMs: number, sampleRate: number): Float32Array {
    const samples = Math.floor((durationMs / 1000) * sampleRate);
    const output = new Float32Array(samples);

    // Mix all active voices
    for (const voice of this.voices.values()) {
      if (voice.active) {
        const voiceBuffer = this.synthesizeVoice(voice, samples, sampleRate);
        for (let i = 0; i < samples; i++) {
          output[i] += voiceBuffer[i];
        }
      }
    }

    // Normalize output to prevent clipping
    this.normalize(output);

    return output;
  }

  /**
   * Get active voice count
   */
  public getActiveVoiceCount(): number {
    return this.voices.size;
  }

  /**
   * Clear all voices
   */
  public clearAllVoices(): void {
    this.voices.clear();
  }

  /**
   * Synthesize a single voice
   */
  private synthesizeVoice(
    voice: VoiceState,
    samples: number,
    sampleRate: number
  ): Float32Array {
    const buffer = new Float32Array(samples);
    const { frequency, amplitude, oscillatorType } = voice.params;

    for (let i = 0; i < samples; i++) {
      const time = i / sampleRate;
      const phase = 2 * Math.PI * frequency * time;

      // Generate waveform based on oscillator type
      let sample = 0;
      switch (oscillatorType) {
        case 'sine':
          sample = Math.sin(phase);
          break;
        case 'square':
          sample = Math.sin(phase) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * ((phase / (2 * Math.PI)) % 1) - 1;
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * ((phase / (2 * Math.PI)) % 1) - 1) - 1;
          break;
        default:
          sample = Math.sin(phase);
      }

      buffer[i] = sample * amplitude;
    }

    // Apply filter if specified
    if (voice.params.filterType && voice.params.filterCutoff) {
      this.applyFilter(buffer, voice.params, sampleRate);
    }

    return buffer;
  }

  /**
   * Apply audio filter
   */
  private applyFilter(
    buffer: Float32Array,
    params: SynthesisParams,
    sampleRate: number
  ): void {
    // Simplified filter implementation
    // In production, would use proper biquad filters
    if (!params.filterCutoff) return;

    const cutoff = params.filterCutoff / sampleRate;
    const alpha = cutoff / (cutoff + 1);

    for (let i = 1; i < buffer.length; i++) {
      buffer[i] = buffer[i - 1] + alpha * (buffer[i] - buffer[i - 1]);
    }
  }

  /**
   * Normalize audio buffer to prevent clipping
   */
  private normalize(buffer: Float32Array): void {
    let max = 0;
    for (let i = 0; i < buffer.length; i++) {
      max = Math.max(max, Math.abs(buffer[i]));
    }

    if (max > 1.0) {
      const scale = 1.0 / max;
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] *= scale;
      }
    }
  }

  /**
   * Voice stealing algorithm - removes oldest voice
   */
  private stealOldestVoice(): void {
    let oldestVoice: VoiceState | null = null;
    let oldestTime = Infinity;

    for (const voice of this.voices.values()) {
      if (voice.startTime < oldestTime) {
        oldestTime = voice.startTime;
        oldestVoice = voice;
      }
    }

    if (oldestVoice) {
      this.voices.delete(oldestVoice.id);
    }
  }
}
