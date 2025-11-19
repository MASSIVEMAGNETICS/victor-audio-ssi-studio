/**
 * MIDI Manager - Phase 2 (v1.4.0)
 * MIDI input/output and routing
 */

export interface MIDIMessage {
  type: 'noteOn' | 'noteOff' | 'controlChange' | 'programChange' | 'pitchBend';
  channel: number;
  note?: number;
  velocity?: number;
  controller?: number;
  value?: number;
  program?: number;
  pitchBend?: number;
  timestamp: number;
}

export interface MIDIDevice {
  id: string;
  name: string;
  manufacturer: string;
  type: 'input' | 'output';
  state: 'connected' | 'disconnected';
}

export type MIDIMessageCallback = (message: MIDIMessage) => void;

export class MIDIManager {
  private midiAccess: unknown = null;
  private initialized = false;
  private inputs: Map<string, unknown> = new Map();
  private outputs: Map<string, unknown> = new Map();
  private messageCallbacks: MIDIMessageCallback[] = [];
  private learnMode = false;
  private learnCallback: ((message: MIDIMessage) => void) | null = null;

  /**
   * Initialize MIDI system
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      throw new Error('MIDI already initialized');
    }

    try {
      // Check for Web MIDI API support
      if (typeof navigator !== 'undefined' && (navigator as unknown as { requestMIDIAccess?: () => Promise<unknown> }).requestMIDIAccess) {
        this.midiAccess = await (navigator as unknown as { requestMIDIAccess: () => Promise<unknown> }).requestMIDIAccess();
      } else {
        console.warn('Web MIDI API not supported, using virtual MIDI');
      }

      this.initialized = true;
      console.log('✓ MIDI Manager initialized');
    } catch (error) {
      throw new Error(`Failed to initialize MIDI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * List available MIDI devices
   */
  listDevices(): MIDIDevice[] {
    const devices: MIDIDevice[] = [];
    return devices;
  }

  /**
   * Subscribe to MIDI messages
   */
  onMessage(callback: MIDIMessageCallback): void {
    this.messageCallbacks.push(callback);
  }

  /**
   * Send MIDI message
   */
  sendMessage(deviceId: string, message: MIDIMessage): void {
    const output = this.outputs.get(deviceId);
    if (!output) {
      throw new Error(`MIDI output device not found: ${deviceId}`);
    }
  }

  /**
   * Enable MIDI learn mode
   */
  enableLearnMode(callback: (message: MIDIMessage) => void): void {
    this.learnMode = true;
    this.learnCallback = callback;
  }

  /**
   * Disable MIDI learn mode
   */
  disableLearnMode(): void {
    this.learnMode = false;
    this.learnCallback = null;
  }

  /**
   * Shutdown MIDI manager
   */
  async shutdown(): Promise<void> {
    this.inputs.clear();
    this.outputs.clear();
    this.messageCallbacks = [];
    this.midiAccess = null;
    this.initialized = false;
    console.log('MIDI Manager shutdown');
  }
}
