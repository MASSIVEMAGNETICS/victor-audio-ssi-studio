/**
 * Collaboration Manager - Phase 4 (v2.0.0)
 * Real-time collaborative audio sessions
 */

export interface CollaborationSession {
  sessionId: string;
  name: string;
  participants: Participant[];
  createdAt: Date;
  isActive: boolean;
}

export interface Participant {
  userId: string;
  username: string;
  role: 'owner' | 'editor' | 'viewer';
  connectedAt: Date;
}

export interface AudioStreamConfig {
  sampleRate: number;
  channels: number;
  bufferSize: number;
}

export type CollaborationEvent = 
  | { type: 'parameter_change'; parameter: string; value: number }
  | { type: 'voice_start'; voiceId: string; frequency: number }
  | { type: 'voice_stop'; voiceId: string }
  | { type: 'chat_message'; message: string; userId: string };

export class CollaborationManager {
  private initialized = false;
  private currentSession: CollaborationSession | null = null;
  private peerConnections: Map<string, unknown> = new Map();
  private eventCallbacks: ((event: CollaborationEvent) => void)[] = [];

  /**
   * Initialize collaboration manager
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      throw new Error('Collaboration Manager already initialized');
    }

    this.initialized = true;
    console.log('✓ Collaboration Manager initialized');
  }

  /**
   * Create a new collaboration session
   */
  async createSession(name: string, audioConfig: AudioStreamConfig): Promise<CollaborationSession> {
    if (!this.initialized) {
      throw new Error('Collaboration Manager not initialized');
    }

    const session: CollaborationSession = {
      sessionId: `session-${Date.now()}`,
      name,
      participants: [],
      createdAt: new Date(),
      isActive: true
    };

    this.currentSession = session;
    console.log(`✓ Session created: ${session.sessionId}`);
    
    return session;
  }

  /**
   * Join existing session
   */
  async joinSession(sessionId: string, userId: string, username: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Collaboration Manager not initialized');
    }

    if (!this.currentSession || this.currentSession.sessionId !== sessionId) {
      throw new Error('Session not found or not active');
    }

    const participant: Participant = {
      userId,
      username,
      role: 'editor',
      connectedAt: new Date()
    };

    this.currentSession.participants.push(participant);
    console.log(`✓ ${username} joined session`);
  }

  /**
   * Leave current session
   */
  async leaveSession(userId: string): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.participants = this.currentSession.participants.filter(
      p => p.userId !== userId
    );

    if (this.currentSession.participants.length === 0) {
      this.currentSession.isActive = false;
    }

    console.log(`User ${userId} left session`);
  }

  /**
   * Broadcast event to all participants
   */
  async broadcastEvent(event: CollaborationEvent): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    // Notify all callbacks
    this.eventCallbacks.forEach(callback => callback(event));
  }

  /**
   * Subscribe to collaboration events
   */
  onEvent(callback: (event: CollaborationEvent) => void): void {
    this.eventCallbacks.push(callback);
  }

  /**
   * Get current session
   */
  getCurrentSession(): CollaborationSession | null {
    return this.currentSession;
  }

  /**
   * Send chat message
   */
  async sendChatMessage(userId: string, message: string): Promise<void> {
    await this.broadcastEvent({
      type: 'chat_message',
      message,
      userId
    });
  }

  /**
   * Shutdown collaboration manager
   */
  async shutdown(): Promise<void> {
    if (this.currentSession) {
      this.currentSession.isActive = false;
    }
    this.peerConnections.clear();
    this.eventCallbacks = [];
    this.currentSession = null;
    this.initialized = false;
    console.log('Collaboration Manager shutdown');
  }
}
