import EcoFlow from "@ecoflow/ecoflow";
import { CliService as ICliService, ICommand } from "@ecoflow/types";
import { spawn, ChildProcess } from "child_process";
import chalk from "chalk";

/**
 * A class that implements the CliService interface and provides methods to start, stop, and restart a service.
 */
export class CliService implements ICliService {
  private args: ICommand = {};
  private status: "Stopped" | "Running" | "Restarting" = "Stopped";
  private process?: ChildProcess;

  /**
   * Generates executable code as a string that initializes an EcoFlow instance
   * with the provided arguments and starts the flow.
   * @returns {string} The generated executable code as a string.
   */
  private get generatedExecutableCode(): string {
    return `
    "use strict";
    const EcoFlow = require("@ecoflow/ecoflow").default;
    (async () => {
      await new EcoFlow({ cli: JSON.parse(\`${JSON.stringify(
        this.args
      )}\`) }).start();
    })();`;
  }

  /**
   * Setter method to update the service status to one of the following values: "Stopped", "Running", or "Restarting".
   * @param {string} status - The new status of the service.
   * @returns None
   */
  private set setserviceStatus(status: "Stopped" | "Running" | "Restarting") {
    this.status = status;
  }

  /**
   * Get the current service status, which can be one of "Stopped", "Running", or "Restarting".
   * @returns The current status of the service.
   */
  get serviceStatus(): "Stopped" | "Running" | "Restarting" {
    return this.status;
  }

  /**
   * Starts the service with the given command arguments.
   * @param {ICommand} [args={}] - The command arguments to start the service with.
   * @returns None
   */
  startService(args: ICommand = {}): void {
    this.args = args;
    this.process = spawn("node", ["-e", this.generatedExecutableCode], {
      cwd: process.cwd(),
      env: Object.assign(process.env, { REBORN: 1 }),
      stdio: ["inherit", "inherit", "inherit", "ipc"],
    });
    this.process.on("spawn", () => {
      this.setserviceStatus = "Running";
      console.log(
        chalk.white("[ ") +
          chalk.green(
            new Date().toLocaleDateString().replace(/\//g, "-") +
              " " +
              new Date().toLocaleTimeString("en-IN", {
                hourCycle: "h23",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
          ) +
          chalk.white(" ]") +
          " : " +
          chalk.white("[ ") +
          chalk.green("EcoFlow") +
          chalk.white(" ]") +
          " : Starting up EcoFlow services"
      );
      if (typeof this.process !== "undefined")
        this.process
          .on("message", (msg) => {
            if (msg === EcoFlow.processCommands.STOP) this.stopService();

            if (msg === EcoFlow.processCommands.RESTART)
              this.restartService(args);
          })
          .on("exit", (code) => {
            this.setserviceStatus = "Stopped";

            if (code !== null && code !== 0)
              console.log(
                chalk.white("[ ") +
                  chalk.green(
                    new Date().toLocaleDateString().replace(/\//g, "-") +
                      " " +
                      new Date().toLocaleTimeString("en-IN", {
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                  ) +
                  chalk.white(" ]") +
                  " : " +
                  chalk.white("[ ") +
                  chalk.green("EcoFlow") +
                  chalk.white(" ]") +
                  " : " +
                  chalk.bgRed(
                    chalk.white(`EcoFlow process stopped with code: ${code}.`)
                  )
              );
          });
    });
  }

  /**
   * Stops the service if it is currently running.
   * @returns void
   */
  stopService(): void {
    if (typeof this.process !== "undefined")
      if (this.process.kill()) {
        this.setserviceStatus = "Stopped";
        console.log(
          chalk.white("[ ") +
            chalk.green(
              new Date().toLocaleDateString().replace(/\//g, "-") +
                " " +
                new Date().toLocaleTimeString("en-IN", {
                  hourCycle: "h23",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
            ) +
            chalk.white(" ]") +
            " : " +
            chalk.white("[ ") +
            chalk.green("EcoFlow") +
            chalk.white(" ]") +
            " : EcoFlow services are stopped"
        );
      }
  }

  /**
   * Restarts the service by setting the service status to "Restarting",
   * stopping the service, and then starting the service with the provided arguments.
   * @param {ICommand} args - The arguments to pass to the service when restarting.
   * @returns void
   */
  restartService(args: ICommand): void {
    this.setserviceStatus = "Restarting";
    this.stopService();
    this.startService(args);
  }
}
