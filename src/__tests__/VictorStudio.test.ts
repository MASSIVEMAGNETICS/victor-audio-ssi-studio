import { VictorStudio } from '../index';
import { ReverbPlugin, DelayPlugin } from '../plugins/BuiltinPlugins';

describe('VictorStudio', () => {
  let studio: VictorStudio;

  beforeEach(() => {
    studio = new VictorStudio();
  });

  afterEach(async () => {
    if (studio.getStatus().initialized) {
      await studio.shutdown();
    }
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      await studio.initialize();
      const status = studio.getStatus();
      expect(status.initialized).toBe(true);
      expect(status.version).toBe('1.0.0');
    });

    it('should throw error when initializing twice', async () => {
      await studio.initialize();
      await expect(studio.initialize()).rejects.toThrow('Studio already initialized');
    });

    it('should throw error when accessing engines before initialization', () => {
      expect(() => studio.getAudioEngine()).toThrow('Studio not initialized');
      expect(() => studio.getSSIEngine()).toThrow('Studio not initialized');
      expect(() => studio.getSynthesisEngine()).toThrow('Studio not initialized');
    });
  });

  describe('Audio Engine', () => {
    beforeEach(async () => {
      await studio.initialize();
    });

    it('should process audio samples', async () => {
      const audioEngine = studio.getAudioEngine();
      const input = {
        data: [new Float32Array([0.5, 0.3, 0.1])],
        sampleRate: 48000,
        duration: 1,
      };

      const result = await audioEngine.process(input);
      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
      expect(result.metrics?.processingTime).toBeGreaterThanOrEqual(0);
    });

    it('should return engine status', () => {
      const audioEngine = studio.getAudioEngine();
      const status = audioEngine.getStatus();
      expect(status.initialized).toBe(true);
      expect(status.config.sampleRate).toBe(48000);
    });
  });

  describe('SSI Engine', () => {
    beforeEach(async () => {
      await studio.initialize();
    });

    it('should generate audio using AI', async () => {
      const ssiEngine = studio.getSSIEngine();
      const context = {
        inputData: new Float32Array([0.1, 0.2, 0.3]),
      };

      const result = await ssiEngine.generate(context);
      expect(result.success).toBe(true);
      expect(result.generatedData).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('should analyze audio data', async () => {
      const ssiEngine = studio.getSSIEngine();
      const data = new Float32Array([0.5, 0.3, 0.1]);

      const result = await ssiEngine.analyze(data);
      expect(result.features).toBeDefined();
      expect(result.insights.length).toBeGreaterThan(0);
    });
  });

  describe('Synthesis Engine', () => {
    beforeEach(async () => {
      await studio.initialize();
    });

    it('should start and stop voices', () => {
      const synthEngine = studio.getSynthesisEngine();
      
      const voiceId = synthEngine.startVoice({
        frequency: 440,
        amplitude: 0.5,
        oscillatorType: 'sine',
      });

      expect(voiceId).toBeGreaterThanOrEqual(0);
      expect(synthEngine.getActiveVoiceCount()).toBe(1);

      synthEngine.stopVoice(voiceId);
      expect(synthEngine.getActiveVoiceCount()).toBe(0);
    });

    it('should synthesize audio buffer', () => {
      const synthEngine = studio.getSynthesisEngine();
      
      synthEngine.startVoice({
        frequency: 440,
        amplitude: 0.5,
        oscillatorType: 'sine',
      });

      const buffer = synthEngine.synthesize(100, 48000);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should respect polyphony limit', () => {
      const synthEngine = studio.getSynthesisEngine();
      const config = studio.getConfig();
      
      // Start more voices than polyphony allows
      for (let i = 0; i < config.synthesis.polyphony + 10; i++) {
        synthEngine.startVoice({
          frequency: 440 + i,
          amplitude: 0.5,
          oscillatorType: 'sine',
        });
      }

      expect(synthEngine.getActiveVoiceCount()).toBeLessThanOrEqual(config.synthesis.polyphony);
    });
  });

  describe('Plugin Manager', () => {
    beforeEach(async () => {
      await studio.initialize();
    });

    it('should register and process plugins', async () => {
      const pluginManager = studio.getPluginManager();
      const reverbPlugin = new ReverbPlugin();
      
      await pluginManager.registerPlugin(reverbPlugin);
      expect(pluginManager.listPlugins()).toContain('reverb');
    });

    it('should process audio through plugin chain', async () => {
      const pluginManager = studio.getPluginManager();
      
      await pluginManager.registerPlugin(new ReverbPlugin());
      await pluginManager.registerPlugin(new DelayPlugin());
      
      pluginManager.setChain(['reverb', 'delay']);
      
      const input = new Float32Array([0.5, 0.3, 0.1]);
      const output = await pluginManager.processChain(input);
      
      expect(output.length).toBe(input.length);
    });

    it('should throw error when setting invalid chain', async () => {
      const pluginManager = studio.getPluginManager();
      
      expect(() => pluginManager.setChain(['nonexistent'])).toThrow();
    });
  });

  describe('Shutdown', () => {
    it('should shutdown gracefully', async () => {
      await studio.initialize();
      await studio.shutdown();
      
      const status = studio.getStatus();
      expect(status.initialized).toBe(false);
    });

    it('should handle multiple shutdown calls', async () => {
      await studio.initialize();
      await studio.shutdown();
      await studio.shutdown(); // Should not throw
    });
  });
});
