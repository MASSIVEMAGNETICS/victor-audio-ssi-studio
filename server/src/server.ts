import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { VictorStudio } from '../../dist/index';
import { SynthesisParams } from '../../dist/synthesis/SynthesisEngine';
import { AIContext } from '../../dist/core/SSIEngine';
import { ReverbPlugin, DelayPlugin, DistortionPlugin } from '../../dist/plugins/BuiltinPlugins';

/**
 * Victor Audio SSI Studio - Backend API Server
 * Provides REST API for audio synthesis and AI generation
 */

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize studio
let studio: VictorStudio | null = null;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    studio: studio ? 'initialized' : 'not initialized',
    timestamp: new Date().toISOString(),
  });
});

// Initialize studio endpoint
app.post('/api/studio/initialize', async (_req: Request, res: Response) => {
  try {
    if (studio) {
      return res.status(400).json({ error: 'Studio already initialized' });
    }

    studio = new VictorStudio();
    await studio.initialize();

    // Register default plugins
    const pluginManager = studio.getPluginManager();
    await pluginManager.registerPlugin(new ReverbPlugin());
    await pluginManager.registerPlugin(new DelayPlugin());
    await pluginManager.registerPlugin(new DistortionPlugin());

    res.json({
      success: true,
      status: studio.getStatus(),
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to initialize studio',
    });
  }
});

// Get studio status
app.get('/api/studio/status', (_req: Request, res: Response) => {
  if (!studio) {
    return res.status(400).json({ error: 'Studio not initialized' });
  }

  res.json(studio.getStatus());
});

// Shutdown studio endpoint
app.post('/api/studio/shutdown', async (_req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    await studio.shutdown();
    studio = null;

    res.json({ success: true, message: 'Studio shutdown successfully' });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to shutdown studio',
    });
  }
});

// Start synthesis voice
app.post('/api/synthesis/start-voice', (req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    const params: SynthesisParams = req.body;
    const synthEngine = studio.getSynthesisEngine();
    const voiceId = synthEngine.startVoice(params);

    res.json({
      success: true,
      voiceId,
      activeVoices: synthEngine.getActiveVoiceCount(),
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to start voice',
    });
  }
});

// Stop synthesis voice
app.post('/api/synthesis/stop-voice/:voiceId', (req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    const voiceId = parseInt(req.params.voiceId);
    const synthEngine = studio.getSynthesisEngine();
    synthEngine.stopVoice(voiceId);

    res.json({
      success: true,
      activeVoices: synthEngine.getActiveVoiceCount(),
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to stop voice',
    });
  }
});

// Synthesize audio
app.post('/api/synthesis/synthesize', (req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    const { duration, sampleRate } = req.body;
    const synthEngine = studio.getSynthesisEngine();
    const buffer = synthEngine.synthesize(duration || 1000, sampleRate || 48000);

    res.json({
      success: true,
      buffer: Array.from(buffer),
      length: buffer.length,
      sampleRate: sampleRate || 48000,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to synthesize',
    });
  }
});

// AI generation endpoint
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    const context: AIContext = {
      inputData: new Float32Array(req.body.inputData || []),
      metadata: req.body.metadata,
    };

    const ssiEngine = studio.getSSIEngine();
    const result = await ssiEngine.generate(context);

    res.json({
      success: result.success,
      generatedData: result.generatedData ? Array.from(result.generatedData) : undefined,
      confidence: result.confidence,
      error: result.error,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate audio',
    });
  }
});

// AI analysis endpoint
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    const data = new Float32Array(req.body.data || []);
    const ssiEngine = studio.getSSIEngine();
    const result = await ssiEngine.analyze(data);

    res.json({
      success: true,
      analysis: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to analyze audio',
    });
  }
});

// Get plugins
app.get('/api/plugins', (_req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    const pluginManager = studio.getPluginManager();
    res.json({
      plugins: pluginManager.listPlugins(),
      chain: pluginManager.getChain(),
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to get plugins',
    });
  }
});

// Set plugin chain
app.post('/api/plugins/chain', (req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    const { chain } = req.body;
    const pluginManager = studio.getPluginManager();
    pluginManager.setChain(chain);

    res.json({
      success: true,
      chain: pluginManager.getChain(),
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to set plugin chain',
    });
  }
});

// Process audio through plugin chain
app.post('/api/plugins/process', async (req: Request, res: Response) => {
  try {
    if (!studio) {
      return res.status(400).json({ error: 'Studio not initialized' });
    }

    const input = new Float32Array(req.body.input || []);
    const pluginManager = studio.getPluginManager();
    const output = await pluginManager.processChain(input);

    res.json({
      success: true,
      output: Array.from(output),
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to process audio',
    });
  }
});

// Serve frontend
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Victor Audio SSI Studio Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🎨 Frontend: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  if (studio) {
    await studio.shutdown();
  }
  process.exit(0);
});
