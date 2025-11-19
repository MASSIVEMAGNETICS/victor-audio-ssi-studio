# Victor Audio SSI Studio - Quick Start Guide

Welcome to Victor Audio SSI Studio! This guide will help you get started with both the web application and the programmatic API.

## 🚀 Getting Started

### Installation

```bash
git clone https://github.com/MASSIVEMAGNETICS/victor-audio-ssi-studio.git
cd victor-audio-ssi-studio
npm install
npm run build
```

### Starting the Web Application

```bash
npm run server
```

Then open your browser to: **http://localhost:3001**

## 🎹 Using the Web Interface

### 1. Initialize the Studio

Click the **"Initialize Studio"** button in the Studio Control panel. You should see:
- Status indicator turns green
- "Studio Initialized" message in the output log
- Available plugins listed

### 2. Play Notes

**Using Mouse:**
- Click on any note button (C4, D4, E4, etc.) to play
- Release to stop

**Using Keyboard:**
- Press keys A, S, D, F, G, H, J, K to play notes
- Release keys to stop

### 3. Adjust Synthesis Parameters

- **Oscillator Type**: Choose from Sine, Square, Sawtooth, or Triangle waveforms
- **Amplitude**: Use the slider to adjust volume (0.0 to 1.0)

### 4. Generate AI Audio

1. Select an AI style (Ambient, Energetic, Calm, Experimental)
2. Click **"Generate Audio"**
3. Watch the AI output log for generation results and confidence scores
4. Click **"Analyze Current"** to analyze the generated audio

### 5. Apply Effects

- Click **"Apply Reverb"** to add reverb effect
- Click **"Apply Delay"** to add delay effect
- Click **"Clear Chain"** to remove all effects

### 6. Watch the Visualizer

The audio visualizer at the bottom displays real-time audio activity as you play notes or generate audio.

## 💻 Using the API

### Initialize Studio

```javascript
const response = await fetch('http://localhost:3001/api/studio/initialize', {
  method: 'POST'
});
const data = await response.json();
console.log('Studio initialized:', data.status);
```

### Play a Note

```javascript
// Start voice
const startResponse = await fetch('http://localhost:3001/api/synthesis/start-voice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    frequency: 440,  // A4 note
    amplitude: 0.5,
    oscillatorType: 'sine'
  })
});
const { voiceId } = await startResponse.json();

// Stop voice after 1 second
setTimeout(async () => {
  await fetch(`http://localhost:3001/api/synthesis/stop-voice/${voiceId}`, {
    method: 'POST'
  });
}, 1000);
```

### Generate AI Audio

```javascript
const response = await fetch('http://localhost:3001/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inputData: Array.from({ length: 100 }, () => Math.random() * 2 - 1),
    metadata: {
      style: 'ambient',
      complexity: 0.7
    }
  })
});

const result = await response.json();
console.log('Generated samples:', result.generatedData.length);
console.log('Confidence:', result.confidence);
```

### Apply Effects

```javascript
// Set plugin chain
await fetch('http://localhost:3001/api/plugins/chain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    chain: ['reverb', 'delay']
  })
});
```

## 🎯 Common Use Cases

### Creating a Melody

```javascript
const notes = [
  { freq: 261.63, duration: 500 },  // C4
  { freq: 293.66, duration: 500 },  // D4
  { freq: 329.63, duration: 500 },  // E4
  { freq: 349.23, duration: 500 },  // F4
];

for (const note of notes) {
  const response = await fetch('http://localhost:3001/api/synthesis/start-voice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      frequency: note.freq,
      amplitude: 0.6,
      oscillatorType: 'sine'
    })
  });
  
  const { voiceId } = await response.json();
  
  await new Promise(resolve => setTimeout(resolve, note.duration));
  
  await fetch(`http://localhost:3001/api/synthesis/stop-voice/${voiceId}`, {
    method: 'POST'
  });
}
```

### Batch AI Generation

```javascript
const styles = ['ambient', 'energetic', 'calm', 'experimental'];

for (const style of styles) {
  const response = await fetch('http://localhost:3001/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      inputData: Array.from({ length: 100 }, () => Math.random() * 2 - 1),
      metadata: { style }
    })
  });
  
  const result = await response.json();
  console.log(`${style}: ${result.confidence * 100}% confidence`);
}
```

## 🔧 Troubleshooting

### Server Won't Start

- Make sure port 3001 is not in use
- Check that you've run `npm install` and `npm run build`
- Try setting a different port: `PORT=3002 npm run server`

### Studio Won't Initialize

- Refresh the page and try again
- Check the browser console for errors
- Make sure the server is running

### No Sound

- This is a synthesis engine - it generates audio data but doesn't play it directly
- The web interface visualizes the audio, but actual playback would require WebAudio integration

## 📖 Next Steps

- Explore the [API Documentation](README.md#-api-documentation)
- Check out the [Architecture](ARCHITECTURE.md)
- Read the [Contributing Guidelines](CONTRIBUTING.md)
- Try the example scripts in the `examples/` directory

## 🆘 Getting Help

If you encounter issues:

1. Check the console/terminal for error messages
2. Review the output logs in the web interface
3. Consult the full README.md for detailed documentation
4. Open an issue on GitHub with details about your problem

---

Happy synthesizing! 🎵
