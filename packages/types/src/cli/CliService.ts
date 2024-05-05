import { ICommand } from "./commands";

/**
 * Interface for a CLI service that provides methods to interact with a service.
 */
export interface CliService {
  /**
   * Get the current service status, which can be one of "Stopped", "Running", or "Restarting".
   * @returns The current status of the service.
   */
  get serviceStatus(): "Stopped" | "Running" | "Restarting";

  /**
   * Starts the service with the given command arguments.
   * @param {ICommand} [args={}] - The command arguments to start the service with.
   * @returns None
   */
  startService(args?: ICommand): void;

  /**
   * Stops the service if it is currently running.
   * @returns void
   */
  stopService(): void;

  /**
   * Restarts the service by setting the service status to "Restarting",
   * stopping the service, and then starting the service with the provided arguments.
   * @param {ICommand} args - The arguments to pass to the service when restarting.
   * @returns void
   */
  restartService(args: ICommand): void;
}
