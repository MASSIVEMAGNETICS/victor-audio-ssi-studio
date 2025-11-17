/**
 * Core Audio Engine Configuration
 * Defines the fundamental parameters for the audio synthesis ecosystem
 */
export interface AudioEngineConfig {
  sampleRate: number;
  bufferSize: number;
  channels: number;
  bitDepth: number;
}

/**
 * AI/ML Model Configuration
 * Configuration for synthetic super intelligence integration
 */
export interface AIModelConfig {
  modelType: 'generative' | 'analytical' | 'hybrid';
  quantumOptimized: boolean;
  learningRate: number;
  contextWindow: number;
}

/**
 * Synthesis Engine Configuration
 * Parameters for audio synthesis algorithms
 */
export interface SynthesisConfig {
  oscillatorTypes: string[];
  filterTypes: string[];
  effectsChain: string[];
  polyphony: number;
}

/**
 * Complete Studio Configuration
 * Aggregates all subsystem configurations
 */
export interface StudioConfig {
  audio: AudioEngineConfig;
  ai: AIModelConfig;
  synthesis: SynthesisConfig;
  version: string;
}

/**
 * Default production-grade configuration
 */
export const DEFAULT_CONFIG: StudioConfig = {
  audio: {
    sampleRate: 48000,
    bufferSize: 512,
    channels: 2,
    bitDepth: 24,
  },
  ai: {
    modelType: 'hybrid',
    quantumOptimized: true,
    learningRate: 0.001,
    contextWindow: 4096,
  },
  synthesis: {
    oscillatorTypes: ['sine', 'square', 'sawtooth', 'triangle', 'custom'],
    filterTypes: ['lowpass', 'highpass', 'bandpass', 'notch', 'allpass'],
    effectsChain: ['reverb', 'delay', 'chorus', 'distortion', 'compression'],
    polyphony: 128,
  },
  version: '1.0.0',
};
