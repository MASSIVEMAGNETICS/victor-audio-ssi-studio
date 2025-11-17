/**
 * Victor Audio SSI Studio - Frontend Application
 * Interactive web interface for audio synthesis
 */

const API_BASE = '/api';
let studioInitialized = false;
let activeVoices = new Map();
let currentBuffer = null;

// Note frequencies (A4 = 440Hz)
const NOTES = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'B4': 493.88,
    'C5': 523.25,
    'D5': 587.33,
    'E5': 659.25,
    'F5': 698.46,
    'G5': 783.99,
};

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    initializeKeyboard();
    initializeVisualizer();
    setupAmplitudeSlider();
    checkHealth();
});

// Setup amplitude slider
function setupAmplitudeSlider() {
    const slider = document.getElementById('amplitude');
    const valueDisplay = document.getElementById('amplitudeValue');
    
    slider.addEventListener('input', (e) => {
        valueDisplay.textContent = e.target.value;
    });
}

// Initialize keyboard
function initializeKeyboard() {
    const keyboard = document.getElementById('keyboard');
    
    Object.entries(NOTES).forEach(([note, frequency]) => {
        const key = document.createElement('div');
        key.className = 'key';
        key.textContent = note;
        key.dataset.frequency = frequency;
        key.dataset.note = note;
        
        key.addEventListener('mousedown', () => startNote(key));
        key.addEventListener('mouseup', () => stopNote(key));
        key.addEventListener('mouseleave', () => stopNote(key));
        
        keyboard.appendChild(key);
    });
}

// Initialize visualizer
function initializeVisualizer() {
    const visualizer = document.getElementById('visualizer');
    
    for (let i = 0; i < 32; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.height = '5px';
        visualizer.appendChild(bar);
    }
}

// Update visualizer with audio data
function updateVisualizer(audioData) {
    const bars = document.querySelectorAll('.visualizer-bar');
    const chunkSize = Math.floor(audioData.length / bars.length);
    
    bars.forEach((bar, index) => {
        const start = index * chunkSize;
        const end = start + chunkSize;
        const chunk = audioData.slice(start, end);
        
        // Calculate RMS for this chunk
        const rms = Math.sqrt(chunk.reduce((sum, val) => sum + val * val, 0) / chunk.length);
        const height = Math.min(100, rms * 300);
        
        bar.style.height = `${height}%`;
    });
}

// Animate visualizer randomly (for demo)
function animateVisualizer() {
    const bars = document.querySelectorAll('.visualizer-bar');
    bars.forEach(bar => {
        const height = Math.random() * 100;
        bar.style.height = `${height}%`;
    });
}

// API Helpers
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Check health
async function checkHealth() {
    try {
        const health = await apiCall('/health');
        updateStatus('Healthy - ' + health.studio, health.studio === 'initialized');
    } catch (error) {
        updateStatus('Server not responding', false);
    }
}

// Update status indicator
function updateStatus(text, active = false) {
    const statusText = document.getElementById('statusText');
    const statusDot = document.getElementById('statusDot');
    
    statusText.textContent = text;
    
    if (active) {
        statusDot.classList.add('active');
    } else {
        statusDot.classList.remove('active');
    }
}

// Update voice count
function updateVoiceCount(count) {
    document.getElementById('voiceCount').textContent = `Voices: ${count}`;
}

// Add output log
function addLog(elementId, message, type = 'info') {
    const output = document.getElementById(elementId);
    const line = document.createElement('div');
    line.className = 'output-line';
    line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    
    // Keep only last 10 lines
    while (output.children.length > 10) {
        output.removeChild(output.firstChild);
    }
}

// Initialize Studio
async function initializeStudio() {
    try {
        addLog('studioOutput', 'Initializing studio...');
        const result = await apiCall('/studio/initialize', 'POST');
        
        studioInitialized = true;
        updateStatus('Studio Initialized', true);
        addLog('studioOutput', `Studio initialized successfully - v${result.status.version}`);
        addLog('studioOutput', `Plugins available: ${result.status.plugins.join(', ')}`);
    } catch (error) {
        addLog('studioOutput', `Error: ${error.message}`);
        updateStatus('Initialization failed', false);
    }
}

// Shutdown Studio
async function shutdownStudio() {
    try {
        addLog('studioOutput', 'Shutting down studio...');
        await apiCall('/studio/shutdown', 'POST');
        
        studioInitialized = false;
        activeVoices.clear();
        updateStatus('Studio Shutdown', false);
        updateVoiceCount(0);
        addLog('studioOutput', 'Studio shutdown successfully');
    } catch (error) {
        addLog('studioOutput', `Error: ${error.message}`);
    }
}

// Start note
async function startNote(keyElement) {
    if (!studioInitialized) {
        addLog('studioOutput', 'Please initialize studio first');
        return;
    }
    
    if (keyElement.classList.contains('playing')) {
        return;
    }
    
    const frequency = parseFloat(keyElement.dataset.frequency);
    const note = keyElement.dataset.note;
    const oscillatorType = document.getElementById('oscillatorType').value;
    const amplitude = parseFloat(document.getElementById('amplitude').value);
    
    try {
        const result = await apiCall('/synthesis/start-voice', 'POST', {
            frequency,
            amplitude,
            oscillatorType,
        });
        
        activeVoices.set(note, result.voiceId);
        keyElement.classList.add('playing');
        updateVoiceCount(result.activeVoices);
        
        // Animate visualizer
        const interval = setInterval(() => {
            if (!keyElement.classList.contains('playing')) {
                clearInterval(interval);
            } else {
                animateVisualizer();
            }
        }, 50);
        
    } catch (error) {
        addLog('studioOutput', `Error starting note: ${error.message}`);
    }
}

// Stop note
async function stopNote(keyElement) {
    if (!keyElement.classList.contains('playing')) {
        return;
    }
    
    const note = keyElement.dataset.note;
    const voiceId = activeVoices.get(note);
    
    if (voiceId !== undefined) {
        try {
            const result = await apiCall(`/synthesis/stop-voice/${voiceId}`, 'POST');
            activeVoices.delete(note);
            keyElement.classList.remove('playing');
            updateVoiceCount(result.activeVoices);
        } catch (error) {
            console.error('Error stopping note:', error);
        }
    }
}

// Generate AI
async function generateAI() {
    if (!studioInitialized) {
        addLog('aiOutput', 'Please initialize studio first');
        return;
    }
    
    try {
        addLog('aiOutput', 'Generating AI audio...');
        
        const style = document.getElementById('aiStyle').value;
        const inputData = Array.from({ length: 100 }, () => Math.random() * 2 - 1);
        
        const result = await apiCall('/ai/generate', 'POST', {
            inputData,
            metadata: { style },
        });
        
        if (result.success && result.generatedData) {
            currentBuffer = result.generatedData;
            addLog('aiOutput', `Generated ${result.generatedData.length} samples`);
            addLog('aiOutput', `Confidence: ${(result.confidence * 100).toFixed(1)}%`);
            addLog('aiOutput', `Style: ${style}`);
            
            // Update visualizer with generated data
            updateVisualizer(result.generatedData);
        }
    } catch (error) {
        addLog('aiOutput', `Error: ${error.message}`);
    }
}

// Analyze audio
async function analyzeAudio() {
    if (!studioInitialized) {
        addLog('aiOutput', 'Please initialize studio first');
        return;
    }
    
    if (!currentBuffer) {
        addLog('aiOutput', 'Generate audio first');
        return;
    }
    
    try {
        addLog('aiOutput', 'Analyzing audio...');
        
        const result = await apiCall('/ai/analyze', 'POST', {
            data: currentBuffer,
        });
        
        if (result.success) {
            addLog('aiOutput', `Classification: ${result.analysis.classification}`);
            addLog('aiOutput', `Insights: ${result.analysis.insights.join(', ')}`);
        }
    } catch (error) {
        addLog('aiOutput', `Error: ${error.message}`);
    }
}

// Apply Reverb
async function applyReverb() {
    if (!studioInitialized) {
        addLog('studioOutput', 'Please initialize studio first');
        return;
    }
    
    try {
        await apiCall('/plugins/chain', 'POST', {
            chain: ['reverb'],
        });
        addLog('studioOutput', 'Reverb plugin activated');
    } catch (error) {
        addLog('studioOutput', `Error: ${error.message}`);
    }
}

// Apply Delay
async function applyDelay() {
    if (!studioInitialized) {
        addLog('studioOutput', 'Please initialize studio first');
        return;
    }
    
    try {
        await apiCall('/plugins/chain', 'POST', {
            chain: ['delay'],
        });
        addLog('studioOutput', 'Delay plugin activated');
    } catch (error) {
        addLog('studioOutput', `Error: ${error.message}`);
    }
}

// Clear plugins
async function clearPlugins() {
    if (!studioInitialized) {
        addLog('studioOutput', 'Please initialize studio first');
        return;
    }
    
    try {
        await apiCall('/plugins/chain', 'POST', {
            chain: [],
        });
        addLog('studioOutput', 'Plugin chain cleared');
    } catch (error) {
        addLog('studioOutput', `Error: ${error.message}`);
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    const keyMap = {
        'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4',
        'g': 'G4', 'h': 'A4', 'j': 'B4', 'k': 'C5',
    };
    
    const note = keyMap[e.key.toLowerCase()];
    if (note && !e.repeat) {
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        if (keyElement) {
            startNote(keyElement);
        }
    }
});

document.addEventListener('keyup', (e) => {
    const keyMap = {
        'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4',
        'g': 'G4', 'h': 'A4', 'j': 'B4', 'k': 'C5',
    };
    
    const note = keyMap[e.key.toLowerCase()];
    if (note) {
        const keyElement = document.querySelector(`[data-note="${note}"]`);
        if (keyElement) {
            stopNote(keyElement);
        }
    }
});
