import { DEFAULT_CONFIG, StudioConfig } from './config/StudioConfig';
import { AudioEngine } from './core/AudioEngine';
import { SSIEngine } from './core/SSIEngine';
import { SynthesisEngine } from './synthesis/SynthesisEngine';
import { PluginManager } from './plugins/PluginManager';

/**
 * Studio Status
 */
export interface StudioStatus {
  initialized: boolean;
  activeVoices: number;
  plugins: string[];
  version: string;
}

/**
 * Victor Audio SSI Studio
 * Main orchestrator for the complete audio synthesis ecosystem
 */
export class VictorStudio {
  private config: StudioConfig;
  private audioEngine: AudioEngine;
  private ssiEngine: SSIEngine;
  private synthesisEngine: SynthesisEngine;
  private pluginManager: PluginManager;
  private initialized: boolean = false;

  constructor(config: StudioConfig = DEFAULT_CONFIG) {
    this.config = config;
    this.audioEngine = new AudioEngine(config.audio);
    this.ssiEngine = new SSIEngine(config.ai);
    this.synthesisEngine = new SynthesisEngine(config.synthesis);
    this.pluginManager = new PluginManager();
  }

  /**
   * Initialize the complete studio ecosystem
   */
  public async initialize(): Promise<void> {
    if (this.initialized) {
      throw new Error('Studio already initialized');
    }

    console.log('Initializing Victor Audio SSI Studio...');

    // Initialize core subsystems in parallel
    await Promise.all([
      this.audioEngine.initialize(),
      this.ssiEngine.initialize(),
    ]);

    console.log('✓ Audio Engine initialized');
    console.log('✓ SSI Engine initialized');
    console.log('✓ Synthesis Engine ready');
    console.log('✓ Plugin Manager ready');

    this.initialized = true;
    console.log(`Victor Audio SSI Studio v${this.config.version} initialized successfully`);
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

  /**
   * Get studio configuration
   */
  public getConfig(): StudioConfig {
    return { ...this.config };
  }

  /**
   * Get studio status
   */
  public getStatus(): StudioStatus {
    return {
      initialized: this.initialized,
      activeVoices: this.initialized ? this.synthesisEngine.getActiveVoiceCount() : 0,
      plugins: this.initialized ? this.pluginManager.listPlugins() : [],
      version: this.config.version,
    };
  }

  /**
   * Shutdown the studio gracefully
   */
  public async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    console.log('Shutting down Victor Audio SSI Studio...');

    // Shutdown subsystems
    await Promise.all([
      this.audioEngine.shutdown(),
      this.ssiEngine.shutdown(),
      this.pluginManager.shutdownAll(),
    ]);

    this.synthesisEngine.clearAllVoices();
    this.initialized = false;

    console.log('Studio shutdown complete');
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
