/**
 * Example: Plugin System
 * Demonstrates the extensible plugin architecture
 */

import { VictorStudio, ReverbPlugin, DelayPlugin, DistortionPlugin } from '../src/index';

async function pluginExample() {
  console.log('=== Victor Audio SSI Studio - Plugin System Example ===\n');

  const studio = new VictorStudio();
  await studio.initialize();

  const pluginManager = studio.getPluginManager();
  const synthEngine = studio.getSynthesisEngine();

  console.log('--- Registering Plugins ---');

  // Register built-in plugins
  const reverb = new ReverbPlugin();
  const delay = new DelayPlugin();
  const distortion = new DistortionPlugin();

  await pluginManager.registerPlugin(reverb);
  console.log('✓ Reverb plugin registered');

  await pluginManager.registerPlugin(delay);
  console.log('✓ Delay plugin registered');

  await pluginManager.registerPlugin(distortion);
  console.log('✓ Distortion plugin registered');

  console.log('\nRegistered plugins:', pluginManager.listPlugins());

  console.log('\n--- Setting Up Plugin Chain ---');

  // Create processing chain: Distortion -> Delay -> Reverb
  pluginManager.setChain(['distortion', 'delay', 'reverb']);
  console.log('Plugin chain:', pluginManager.getChain());

  console.log('\n--- Processing Audio Through Plugins ---');

  // Generate some audio
  const voiceId = synthEngine.startVoice({
    frequency: 220, // A3
    amplitude: 0.7,
    oscillatorType: 'sawtooth',
  });

  const rawAudio = synthEngine.synthesize(200, 48000);
  console.log('Raw audio buffer:', rawAudio.length, 'samples');

  // Process through plugin chain
  const processedAudio = await pluginManager.processChain(rawAudio);
  console.log('Processed audio buffer:', processedAudio.length, 'samples');

  // Calculate simple metrics
  const rawRMS = Math.sqrt(
    rawAudio.reduce((sum, val) => sum + val * val, 0) / rawAudio.length
  );
  const processedRMS = Math.sqrt(
    processedAudio.reduce((sum, val) => sum + val * val, 0) / processedAudio.length
  );

  console.log('\nAudio Metrics:');
  console.log('  Raw RMS:', rawRMS.toFixed(4));
  console.log('  Processed RMS:', processedRMS.toFixed(4));

  console.log('\n--- Modifying Plugin Chain ---');

  // Change the chain order
  pluginManager.setChain(['delay', 'reverb']);
  console.log('New plugin chain:', pluginManager.getChain());

  const processedAudio2 = await pluginManager.processChain(rawAudio);
  const processedRMS2 = Math.sqrt(
    processedAudio2.reduce((sum, val) => sum + val * val, 0) / processedAudio2.length
  );
  console.log('New processed RMS:', processedRMS2.toFixed(4));

  // Clean up
  synthEngine.stopVoice(voiceId);
  await studio.shutdown();
  console.log('\nPlugin example complete');
}

if (require.main === module) {
  pluginExample().catch(console.error);
}

export { pluginExample };
