/**
 * Example: Advanced AI-Powered Synthesis
 * Demonstrates AI integration with synthesis engine
 */

import { VictorStudio } from '../src/index';

async function advancedAIExample() {
  console.log('=== Victor Audio SSI Studio - Advanced AI Example ===\n');

  const studio = new VictorStudio();
  await studio.initialize();

  const ssiEngine = studio.getSSIEngine();
  const synthEngine = studio.getSynthesisEngine();

  console.log('--- AI-Powered Generative Synthesis ---');

  // Generate multiple variations using AI
  for (let i = 0; i < 3; i++) {
    console.log(`\nGeneration ${i + 1}:`);

    // Create input context
    const context = {
      inputData: new Float32Array(Array.from({ length: 100 }, () => Math.random())),
      metadata: {
        style: 'ambient',
        complexity: 0.7,
      },
    };

    // Generate with AI
    const result = await ssiEngine.generate(context);
    
    if (result.success && result.generatedData) {
      console.log('  Generated samples:', result.generatedData.length);
      console.log('  Confidence:', result.confidence);

      // Analyze the generated content
      const analysis = await ssiEngine.analyze(result.generatedData);
      console.log('  Features:', analysis.features);
      console.log('  Classification:', analysis.classification);
      console.log('  Insights:', analysis.insights);
    }
  }

  console.log('\n--- Polyphonic Synthesis ---');

  // Create a chord using multiple voices
  const chord = [
    { frequency: 261.63, name: 'C4' },
    { frequency: 329.63, name: 'E4' },
    { frequency: 392.00, name: 'G4' },
  ];

  const voiceIds = chord.map(note => {
    const id = synthEngine.startVoice({
      frequency: note.frequency,
      amplitude: 0.3,
      oscillatorType: 'sine',
      filterType: 'lowpass',
      filterCutoff: 2000,
    });
    console.log(`Started ${note.name} (voice ${id})`);
    return id;
  });

  console.log(`\nActive voices: ${synthEngine.getActiveVoiceCount()}`);

  // Synthesize the chord
  const chordBuffer = synthEngine.synthesize(500, 48000);
  console.log(`Synthesized chord buffer: ${chordBuffer.length} samples`);

  // Stop all voices
  voiceIds.forEach(id => synthEngine.stopVoice(id));
  console.log(`Active voices after stop: ${synthEngine.getActiveVoiceCount()}`);

  await studio.shutdown();
  console.log('\nAdvanced example complete');
}

if (require.main === module) {
  advancedAIExample().catch(console.error);
}

export { advancedAIExample };
