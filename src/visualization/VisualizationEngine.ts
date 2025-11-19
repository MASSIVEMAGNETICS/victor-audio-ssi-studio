/**
 * Visualization Engine - Phase 5 (v2.3.0)
 * Real-time waveform and spectrum visualization
 */

export type VisualizationType = 'waveform' | 'spectrum' | 'spectrogram' | 'phase' | '3d';

export interface VisualizationConfig {
  type: VisualizationType;
  width: number;
  height: number;
  colorScheme: 'default' | 'dark' | 'light' | 'rainbow';
  fftSize?: number;
  smoothing?: number;
}

export interface WaveformData {
  samples: Float32Array;
  sampleRate: number;
  channels: number;
}

export interface SpectrumData {
  frequencies: Float32Array;
  magnitudes: Float32Array;
  fftSize: number;
}

export class VisualizationEngine {
  private initialized = false;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private config: VisualizationConfig;
  private animationFrameId: number | null = null;

  constructor(config: VisualizationConfig) {
    this.config = config;
  }

  /**
   * Initialize visualization engine
   */
  async initialize(canvas?: HTMLCanvasElement): Promise<void> {
    if (this.initialized) {
      throw new Error('Visualization Engine already initialized');
    }

    if (canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext('2d');
    }

    this.initialized = true;
    console.log('✓ Visualization Engine initialized');
  }

  /**
   * Render waveform visualization
   */
  renderWaveform(data: WaveformData): void {
    if (!this.context || !this.canvas) {
      console.warn('Canvas not available for rendering');
      return;
    }

    const { width, height } = this.config;
    const ctx = this.context;

    // Clear canvas
    ctx.fillStyle = this.getBackgroundColor();
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    ctx.strokeStyle = this.getForegroundColor();
    ctx.lineWidth = 2;
    ctx.beginPath();

    const step = data.samples.length / width;
    const amp = height / 2;

    for (let i = 0; i < width; i++) {
      const index = Math.floor(i * step);
      const sample = data.samples[index] || 0;
      const y = amp + sample * amp;

      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }

    ctx.stroke();
  }

  /**
   * Render spectrum visualization
   */
  renderSpectrum(data: SpectrumData): void {
    if (!this.context || !this.canvas) {
      console.warn('Canvas not available for rendering');
      return;
    }

    const { width, height } = this.config;
    const ctx = this.context;

    // Clear canvas
    ctx.fillStyle = this.getBackgroundColor();
    ctx.fillRect(0, 0, width, height);

    // Draw spectrum bars
    const barWidth = width / data.magnitudes.length;
    
    for (let i = 0; i < data.magnitudes.length; i++) {
      const magnitude = data.magnitudes[i];
      const barHeight = (magnitude / 255) * height;
      const x = i * barWidth;
      const y = height - barHeight;

      ctx.fillStyle = this.getBarColor(i, data.magnitudes.length);
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  }

  /**
   * Render spectrogram visualization
   */
  renderSpectrogram(data: SpectrumData): void {
    if (!this.context) {
      console.warn('Canvas not available for rendering');
      return;
    }

    // Placeholder for spectrogram rendering
    console.log('Spectrogram rendering placeholder');
  }

  /**
   * Start continuous rendering
   */
  startRendering(dataSource: () => WaveformData | SpectrumData): void {
    const render = (): void => {
      const data = dataSource();
      
      if ('samples' in data) {
        this.renderWaveform(data as WaveformData);
      } else {
        this.renderSpectrum(data as SpectrumData);
      }

      this.animationFrameId = requestAnimationFrame(render);
    };

    render();
  }

  /**
   * Stop continuous rendering
   */
  stopRendering(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get background color based on color scheme
   */
  private getBackgroundColor(): string {
    switch (this.config.colorScheme) {
      case 'dark': return '#000000';
      case 'light': return '#FFFFFF';
      default: return '#1a1a1a';
    }
  }

  /**
   * Get foreground color based on color scheme
   */
  private getForegroundColor(): string {
    switch (this.config.colorScheme) {
      case 'dark': return '#00FF00';
      case 'light': return '#0000FF';
      default: return '#00FFFF';
    }
  }

  /**
   * Get bar color for spectrum visualization
   */
  private getBarColor(index: number, total: number): string {
    if (this.config.colorScheme === 'rainbow') {
      const hue = (index / total) * 360;
      return `hsl(${hue}, 100%, 50%)`;
    }
    return this.getForegroundColor();
  }

  /**
   * Export visualization as image
   */
  async exportImage(): Promise<Blob | null> {
    if (!this.canvas) return null;

    return new Promise((resolve) => {
      this.canvas!.toBlob((blob) => resolve(blob));
    });
  }

  /**
   * Shutdown visualization engine
   */
  async shutdown(): Promise<void> {
    this.stopRendering();
    this.canvas = null;
    this.context = null;
    this.initialized = false;
    console.log('Visualization Engine shutdown');
  }
}
