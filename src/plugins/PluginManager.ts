/**
 * Plugin Interface
 * Base interface for all studio plugins
 */
export interface IPlugin {
  name: string;
  version: string;
  initialize(): Promise<void>;
  process(input: Float32Array): Promise<Float32Array>;
  shutdown(): Promise<void>;
}

/**
 * Plugin Metadata
 */
export interface PluginMetadata {
  name: string;
  version: string;
  author: string;
  description: string;
  category: 'effect' | 'instrument' | 'analysis' | 'utility';
}

/**
 * Plugin Manager
 * Manages plugin lifecycle and routing
 */
export class PluginManager {
  private plugins: Map<string, IPlugin> = new Map();
  private pluginChain: string[] = [];

  /**
   * Register a plugin
   */
  public async registerPlugin(plugin: IPlugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin ${plugin.name} already registered`);
    }

    await plugin.initialize();
    this.plugins.set(plugin.name, plugin);
  }

  /**
   * Unregister a plugin
   */
  public async unregisterPlugin(pluginName: string): Promise<void> {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      await plugin.shutdown();
      this.plugins.delete(pluginName);
      this.pluginChain = this.pluginChain.filter(name => name !== pluginName);
    }
  }

  /**
   * Set plugin processing chain order
   */
  public setChain(pluginNames: string[]): void {
    // Validate all plugins exist
    for (const name of pluginNames) {
      if (!this.plugins.has(name)) {
        throw new Error(`Plugin ${name} not found`);
      }
    }
    this.pluginChain = [...pluginNames];
  }

  /**
   * Process audio through plugin chain
   */
  public async processChain(input: Float32Array): Promise<Float32Array> {
    let output = input;

    for (const pluginName of this.pluginChain) {
      const plugin = this.plugins.get(pluginName);
      if (plugin) {
        output = await plugin.process(output);
      }
    }

    return output;
  }

  /**
   * Get plugin by name
   */
  public getPlugin(name: string): IPlugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * List all registered plugins
   */
  public listPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Get current plugin chain
   */
  public getChain(): string[] {
    return [...this.pluginChain];
  }

  /**
   * Shutdown all plugins
   */
  public async shutdownAll(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      await plugin.shutdown();
    }
    this.plugins.clear();
    this.pluginChain = [];
  }
}
