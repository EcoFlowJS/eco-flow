import EcoFlow from "@eco-flow/ecoflow";
import { CliService as ICliService, ICommand } from "@eco-flow/types";
import { spawn, ChildProcess } from "child_process";
import chalk from "chalk";

export class CliService implements ICliService {
  private args: ICommand = {};
  private status: "Stopped" | "Running" | "Restarting" = "Stopped";
  private process?: ChildProcess;

  private get generatedExecutableCode(): string {
    return `
    "use strict";
    const EcoFlow = require("@eco-flow/ecoflow").default;
    (async () => {
      await new EcoFlow({ cli: JSON.parse(\`${JSON.stringify(
        this.args
      )}\`) }).start();
    })();`;
  }

  private set setserviceStatus(status: "Stopped" | "Running" | "Restarting") {
    this.status = status;
  }

  get serviceStatus(): "Stopped" | "Running" | "Restarting" {
    return this.status;
  }

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
  restartService(args: ICommand): void {
    this.setserviceStatus = "Restarting";
    this.stopService();
    this.startService(args);
  }
}
