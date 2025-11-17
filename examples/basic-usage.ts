/**
 * Example: Basic Studio Usage
 * Demonstrates how to initialize and use the Victor Audio SSI Studio
 */

import { VictorStudio } from '../src/index';

async function basicExample() {
  console.log('=== Victor Audio SSI Studio - Basic Example ===\n');

  // Create studio instance with default configuration
  const studio = new VictorStudio();

  // Initialize the studio
  await studio.initialize();

  // Get studio status
  const status = studio.getStatus();
  console.log('Studio Status:', status);

  // Access individual engines
  const audioEngine = studio.getAudioEngine();
  const ssiEngine = studio.getSSIEngine();
  const synthEngine = studio.getSynthesisEngine();

  console.log('\n--- Audio Processing ---');
  
  // Process audio through the engine
  const audioSample = {
    data: [new Float32Array(4800)], // 100ms at 48kHz
    sampleRate: 48000,
    duration: 0.1,
  };

  const processResult = await audioEngine.process(audioSample);
  console.log('Audio processing result:', processResult.success);
  console.log('Processing time:', processResult.metrics?.processingTime, 'ms');

  console.log('\n--- AI Generation ---');

  // Generate audio using AI
  const aiContext = {
    inputData: new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5]),
  };

  const genResult = await ssiEngine.generate(aiContext);
  console.log('AI generation result:', genResult.success);
  console.log('Confidence:', genResult.confidence);

  console.log('\n--- Audio Synthesis ---');

  // Start synthesizing a note
  const voiceId = synthEngine.startVoice({
    frequency: 440, // A4
    amplitude: 0.5,
    oscillatorType: 'sine',
  });

  console.log('Started voice ID:', voiceId);
  console.log('Active voices:', synthEngine.getActiveVoiceCount());

  // Synthesize audio buffer
  const buffer = synthEngine.synthesize(100, 48000);
  console.log('Synthesized buffer length:', buffer.length);

  // Stop the voice
  synthEngine.stopVoice(voiceId);
  console.log('Active voices after stop:', synthEngine.getActiveVoiceCount());

  // Shutdown studio
  await studio.shutdown();
  console.log('\nStudio shutdown complete');
}

// Run if executed directly
if (require.main === module) {
  basicExample().catch(console.error);
}

export { basicExample };
