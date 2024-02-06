import { ICommand } from "./commands";

export interface CliService {
  get serviceStatus(): "Stopped" | "Running" | "Restarting";

  startService(args?: ICommand): void;
  stopService(): void;
  restartService(args: ICommand): void;
}
