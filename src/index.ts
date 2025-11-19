import { DEFAULT_CONFIG, StudioConfig } from './config/StudioConfig';
import { AudioEngine } from './core/AudioEngine';
import { SSIEngine } from './core/SSIEngine';
import { SynthesisEngine } from './synthesis/SynthesisEngine';
import { PluginManager } from './plugins/PluginManager';

// Phase 1: Browser & Performance
import { WebAssemblyCore } from './wasm/WebAssemblyCore';
import { FFTProcessor } from './dsp/FFTProcessor';

// Phase 2: MIDI & I/O
import { MIDIManager } from './midi/MIDIManager';
import { AudioFileIO } from './fileio/AudioFileIO';

// Phase 3: Advanced AI & ML
import { MLTrainingPipeline } from './ml/MLTrainingPipeline';

// Phase 4: Collaboration & Cloud
import { CollaborationManager } from './collaboration/CollaborationManager';

// Phase 5: Visual & UX
import { VisualizationEngine } from './visualization/VisualizationEngine';

// Phase 6: Quantum & Research
import { QuantumProcessor } from './quantum/QuantumProcessor';

/**
 * Studio Status
 */
export interface StudioStatus {
  initialized: boolean;
  activeVoices: number;
  plugins: string[];
  version: string;
  roadmapFeatures: {
    webAssembly: boolean;
    fft: boolean;
    midi: boolean;
    fileIO: boolean;
    mlTraining: boolean;
    collaboration: boolean;
    visualization: boolean;
    quantum: boolean;
  };
}

/**
 * Victor Audio SSI Studio
 * Main orchestrator for the complete audio synthesis ecosystem
 * Now with full roadmap implementation!
 */
export class VictorStudio {
  private config: StudioConfig;
  private audioEngine: AudioEngine;
  private ssiEngine: SSIEngine;
  private synthesisEngine: SynthesisEngine;
  private pluginManager: PluginManager;
  
  // Roadmap Phase 1: Browser & Performance
  private webAssemblyCore: WebAssemblyCore;
  private fftProcessor: FFTProcessor;
  
  // Roadmap Phase 2: MIDI & I/O
  private midiManager: MIDIManager;
  private audioFileIO: AudioFileIO;
  
  // Roadmap Phase 3: Advanced AI & ML
  private mlPipeline: MLTrainingPipeline;
  
  // Roadmap Phase 4: Collaboration & Cloud
  private collaborationManager: CollaborationManager;
  
  // Roadmap Phase 5: Visual & UX
  private visualizationEngine: VisualizationEngine | null = null;
  
  // Roadmap Phase 6: Quantum & Research
  private quantumProcessor: QuantumProcessor;
  
  private initialized: boolean = false;

  constructor(config: StudioConfig = DEFAULT_CONFIG) {
    this.config = config;
    
    // Core components
    this.audioEngine = new AudioEngine(config.audio);
    this.ssiEngine = new SSIEngine(config.ai);
    this.synthesisEngine = new SynthesisEngine(config.synthesis);
    this.pluginManager = new PluginManager();
    
    // Roadmap components
    this.webAssemblyCore = new WebAssemblyCore();
    this.fftProcessor = new FFTProcessor(2048, config.audio.sampleRate);
    this.midiManager = new MIDIManager();
    this.audioFileIO = new AudioFileIO();
    this.mlPipeline = new MLTrainingPipeline();
    this.collaborationManager = new CollaborationManager();
    this.quantumProcessor = new QuantumProcessor();
  }

  /**
   * Initialize the complete studio ecosystem with ALL roadmap features
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      throw new Error('Studio already initialized');
    }

    console.log('Initializing Victor Audio SSI Studio with COMPLETE ROADMAP...');

    // Initialize ALL subsystems in parallel
    await Promise.all([
      // Core (Phase 0)
      this.audioEngine.initialize(),
      this.ssiEngine.initialize(),
      
      // Phase 1: Browser & Performance
      this.webAssemblyCore.initialize(),
      
      // Phase 2: MIDI & I/O
      this.midiManager.initialize(),
      this.audioFileIO.initialize(),
      
      // Phase 3: Advanced AI & ML
      this.mlPipeline.initialize(),
      
      // Phase 4: Collaboration & Cloud
      this.collaborationManager.initialize(),
      
      // Phase 6: Quantum & Research
      this.quantumProcessor.initialize(),
    ]);

    console.log('✓ Audio Engine initialized');
    console.log('✓ SSI Engine initialized');
    console.log('✓ Synthesis Engine ready');
    console.log('✓ Plugin Manager ready');
    console.log('✓ WebAssembly Core initialized (Phase 1)');
    console.log('✓ FFT Processor ready (Phase 1)');
    console.log('✓ MIDI Manager initialized (Phase 2)');
    console.log('✓ Audio File I/O initialized (Phase 2)');
    console.log('✓ ML Training Pipeline initialized (Phase 3)');
    console.log('✓ Collaboration Manager initialized (Phase 4)');
    console.log('✓ Quantum Processor initialized (Phase 6)');

    this.initialized = true;
    console.log(`\n🎉 Victor Audio SSI Studio v${this.config.version} - COMPLETE ROADMAP INITIALIZED! 🎉`);
    console.log('All 6 phases of the roadmap are now available!\n');
  }

  /**
   * Get audio engine instance
   */
  public getAudioEngine(): AudioEngine {
    this.ensureInitialized();
    return this.audioEngine;
  }

  /**
   * Get SSI engine instance
   */
  public getSSIEngine(): SSIEngine {
    this.ensureInitialized();
    return this.ssiEngine;
  }

  /**
   * Get synthesis engine instance
   */
  public getSynthesisEngine(): SynthesisEngine {
    this.ensureInitialized();
    return this.synthesisEngine;
  }

  /**
   * Get plugin manager instance
   */
  public getPluginManager(): PluginManager {
    this.ensureInitialized();
    return this.pluginManager;
  }
  
  // Roadmap Phase 1: Browser & Performance
  
  /**
   * Get WebAssembly core instance
   */
  public getWebAssemblyCore(): WebAssemblyCore {
    this.ensureInitialized();
    return this.webAssemblyCore;
  }
  
  /**
   * Get FFT processor instance
   */
  public getFFTProcessor(): FFTProcessor {
    this.ensureInitialized();
    return this.fftProcessor;
  }
  
  // Roadmap Phase 2: MIDI & I/O
  
  /**
   * Get MIDI manager instance
   */
  public getMIDIManager(): MIDIManager {
    this.ensureInitialized();
    return this.midiManager;
  }
  
  /**
   * Get audio file I/O instance
   */
  public getAudioFileIO(): AudioFileIO {
    this.ensureInitialized();
    return this.audioFileIO;
  }
  
  // Roadmap Phase 3: Advanced AI & ML
  
  /**
   * Get ML training pipeline instance
   */
  public getMLPipeline(): MLTrainingPipeline {
    this.ensureInitialized();
    return this.mlPipeline;
  }
  
  // Roadmap Phase 4: Collaboration & Cloud
  
  /**
   * Get collaboration manager instance
   */
  public getCollaborationManager(): CollaborationManager {
    this.ensureInitialized();
    return this.collaborationManager;
  }
  
  // Roadmap Phase 5: Visual & UX
  
  /**
   * Get visualization engine instance
   */
  public getVisualizationEngine(): VisualizationEngine | null {
    this.ensureInitialized();
    return this.visualizationEngine;
  }
  
  /**
   * Create visualization engine with canvas
   */
  public async createVisualizationEngine(canvas: HTMLCanvasElement, config?: {
    type?: 'waveform' | 'spectrum' | 'spectrogram' | 'phase' | '3d';
    colorScheme?: 'default' | 'dark' | 'light' | 'rainbow';
  }): Promise<VisualizationEngine> {
    this.ensureInitialized();
    
    this.visualizationEngine = new VisualizationEngine({
      type: config?.type || 'waveform',
      width: canvas.width,
      height: canvas.height,
      colorScheme: config?.colorScheme || 'default'
    });
    
    await this.visualizationEngine.initialize(canvas);
    return this.visualizationEngine;
  }
  
  // Roadmap Phase 6: Quantum & Research
  
  /**
   * Get quantum processor instance
   */
  public getQuantumProcessor(): QuantumProcessor {
    this.ensureInitialized();
    return this.quantumProcessor;
  }

  /**
   * Get studio configuration
   */
  public getConfig(): StudioConfig {
    return { ...this.config };
  }

  /**
   * Get studio status including roadmap features
   */
  public getStatus(): StudioStatus {
    return {
      initialized: this.initialized,
      activeVoices: this.initialized ? this.synthesisEngine.getActiveVoiceCount() : 0,
      plugins: this.initialized ? this.pluginManager.listPlugins() : [],
      version: this.config.version,
      roadmapFeatures: {
        webAssembly: this.initialized,
        fft: this.initialized,
        midi: this.initialized,
        fileIO: this.initialized,
        mlTraining: this.initialized,
        collaboration: this.initialized,
        visualization: this.visualizationEngine !== null,
        quantum: this.initialized
      }
    };
  }

  /**
   * Shutdown the studio gracefully (all roadmap features)
   */
  public async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    console.log('Shutting down Victor Audio SSI Studio (all features)...');

    // Shutdown ALL subsystems
    await Promise.all([
      // Core
      this.audioEngine.shutdown(),
      this.ssiEngine.shutdown(),
      this.pluginManager.shutdownAll(),
      
      // Phase 1
      this.webAssemblyCore.shutdown(),
      
      // Phase 2
      this.midiManager.shutdown(),
      this.audioFileIO.shutdown(),
      
      // Phase 3
      this.mlPipeline.shutdown(),
      
      // Phase 4
      this.collaborationManager.shutdown(),
      
      // Phase 5
      this.visualizationEngine?.shutdown() || Promise.resolve(),
      
      // Phase 6
      this.quantumProcessor.shutdown(),
    ]);

    this.synthesisEngine.clearAllVoices();
    this.visualizationEngine = null;
    this.initialized = false;

    console.log('Studio shutdown complete - all roadmap features stopped');
  }

  /**
   * Ensure studio is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Studio not initialized. Call initialize() first.');
    }
  }
}

/**
 * Export main studio class and configuration
 */
export { StudioConfig, DEFAULT_CONFIG } from './config/StudioConfig';
export { AudioEngine, AudioSample, ProcessingResult } from './core/AudioEngine';
export { SSIEngine, AIContext, AIGenerationResult } from './core/SSIEngine';
export { SynthesisEngine, SynthesisParams } from './synthesis/SynthesisEngine';
export { PluginManager, IPlugin } from './plugins/PluginManager';
export { ReverbPlugin, DelayPlugin, DistortionPlugin } from './plugins/BuiltinPlugins';

// Roadmap Phase 1: Browser & Performance
export { WebAssemblyCore, WasmModuleConfig } from './wasm/WebAssemblyCore';
export { FFTProcessor, FFTSize, FFTResult, SpectralAnalysis } from './dsp/FFTProcessor';

// Roadmap Phase 2: MIDI & I/O
export { MIDIManager, MIDIMessage, MIDIDevice } from './midi/MIDIManager';
export { AudioFileIO, AudioFormat, AudioFileMetadata, AudioFileData } from './fileio/AudioFileIO';

// Roadmap Phase 3: Advanced AI & ML
export { MLTrainingPipeline, TrainingConfig, TrainingData, ModelArtifact } from './ml/MLTrainingPipeline';

// Roadmap Phase 4: Collaboration & Cloud
export { CollaborationManager, CollaborationSession, Participant, CollaborationEvent } from './collaboration/CollaborationManager';

// Roadmap Phase 5: Visual & UX
export { VisualizationEngine, VisualizationType, VisualizationConfig, WaveformData, SpectrumData } from './visualization/VisualizationEngine';

// Roadmap Phase 6: Quantum & Research
export { QuantumProcessor, QuantumCircuit, QuantumGate, QuantumResult } from './quantum/QuantumProcessor';
