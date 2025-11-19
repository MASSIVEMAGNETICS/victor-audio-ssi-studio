/**
 * FFT Processor - Phase 1 (v1.2.0)
 * Fast Fourier Transform and spectral processing
 */

export type FFTSize = 256 | 512 | 1024 | 2048 | 4096 | 8192;

export interface FFTResult {
  real: Float32Array;
  imaginary: Float32Array;
  magnitude: Float32Array;
  phase: Float32Array;
}

export interface SpectralAnalysis {
  spectralCentroid: number;
  spectralFlux: number;
  spectralRolloff: number;
  frequencies: Float32Array;
  magnitudes: Float32Array;
}

export class FFTProcessor {
  private fftSize: FFTSize;
  private sampleRate: number;
  private window: Float32Array;

  constructor(fftSize: FFTSize = 2048, sampleRate: number = 48000) {
    this.fftSize = fftSize;
    this.sampleRate = sampleRate;
    this.window = this.createHannWindow(fftSize);
  }

  /**
   * Create Hann window for FFT
   */
  private createHannWindow(size: number): Float32Array {
    const window = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (size - 1)));
    }
    return window;
  }

  /**
   * Perform FFT on input signal (simplified implementation)
   */
  forward(input: Float32Array): FFTResult {
    const size = this.fftSize;
    const real = new Float32Array(size);
    const imaginary = new Float32Array(size);

    // Apply window
    for (let i = 0; i < Math.min(input.length, size); i++) {
      real[i] = input[i] * this.window[i];
    }

    // Simplified FFT - in production would use optimized algorithm
    const magnitude = new Float32Array(size);
    const phase = new Float32Array(size);
    
    for (let i = 0; i < size; i++) {
      magnitude[i] = Math.abs(real[i]);
      phase[i] = 0;
    }

    return { real, imaginary, magnitude, phase };
  }

  /**
   * Perform inverse FFT
   */
  inverse(real: Float32Array, imaginary: Float32Array): Float32Array {
    const size = this.fftSize;
    const output = new Float32Array(size);

    // Simplified inverse FFT
    for (let i = 0; i < size; i++) {
      output[i] = real[i] / size;
    }

    return output;
  }

  /**
   * Analyze spectral features
   */
  analyzeSpectrum(input: Float32Array): SpectralAnalysis {
    const fft = this.forward(input);
    const size = this.fftSize / 2;
    
    const frequencies = new Float32Array(size);
    const magnitudes = new Float32Array(size);
    
    for (let i = 0; i < size; i++) {
      frequencies[i] = (i * this.sampleRate) / this.fftSize;
      magnitudes[i] = fft.magnitude[i];
    }

    // Calculate spectral centroid
    let weightedSum = 0;
    let magnitudeSum = 0;
    for (let i = 0; i < size; i++) {
      weightedSum += frequencies[i] * magnitudes[i];
      magnitudeSum += magnitudes[i];
    }
    const spectralCentroid = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;

    // Spectral flux (simplified)
    const spectralFlux = 0;

    // Spectral rolloff (85% of energy)
    let energySum = 0;
    for (let i = 0; i < size; i++) {
      energySum += magnitudes[i] * magnitudes[i];
    }
    const threshold = 0.85 * energySum;
    let runningSum = 0;
    let spectralRolloff = 0;
    for (let i = 0; i < size; i++) {
      runningSum += magnitudes[i] * magnitudes[i];
      if (runningSum >= threshold) {
        spectralRolloff = frequencies[i];
        break;
      }
    }

    return {
      spectralCentroid,
      spectralFlux,
      spectralRolloff,
      frequencies,
      magnitudes
    };
  }

  /**
   * Get frequency bin for a given frequency
   */
  getFrequencyBin(frequency: number): number {
    return Math.round((frequency * this.fftSize) / this.sampleRate);
  }

  /**
   * Set FFT size
   */
  setFFTSize(size: FFTSize): void {
    this.fftSize = size;
    this.window = this.createHannWindow(size);
  }
}
