/**
 * Interface for EcoEditors that defines a method to load editors.
 */
export interface EcoEditors {
  /**
   * Asynchronously loads the editors based on the environment and configuration settings.
   * If the environment is in development, it sets up proxy routes and initializes the editors router.
   * If the environment is not in development, it configures the editor settings based on the configuration.
   * @returns Promise<void>
   */
  loadEditors(): void;
}
