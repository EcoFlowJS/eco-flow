#! /usr/bin/env node
import fs from "fs";
import { CommanderCli } from "./lib/CommanderCli";
import { LogLevel } from "../utils/logger/lib/logger.interface";
import { EcoFlow } from "../core";
import { ICommand } from "./commands/command";

let commands = new CommanderCli().parseArgs().commands;
let isAdminCommand = commands.hasOwnProperty("_admin");

if (isAdminCommand) {
  // TODO: Add support for admin commands in the future for now just console logging the commands.
  console.log("Admin command executated successfully");
  console.log(commands);
  process.exit(0);
}

let defaultsCliCommands: ICommand = {};

if (commands.hasOwnProperty("host") && typeof commands.host === "string")
  defaultsCliCommands.Host = commands.host;

if (
  commands.hasOwnProperty("port") &&
  typeof parseInt(commands.port) === "number"
)
  defaultsCliCommands.Port = parseInt(commands.port);

if (commands.hasOwnProperty("auth") && typeof commands.auth === "boolean")
  defaultsCliCommands.auth = commands.auth;

if (
  commands.hasOwnProperty("configDir") &&
  typeof commands.configDir === "string" &&
  fs.existsSync(commands.configDir) &&
  fs.lstatSync(commands.configDir).isDirectory()
)
  defaultsCliCommands.configDir = commands.configDir;

if (
  commands.hasOwnProperty("configName") &&
  typeof commands.configName === "string"
)
  defaultsCliCommands.configName = commands.configName;

if (
  commands.hasOwnProperty("user") &&
  typeof commands.user === "string" &&
  fs.existsSync(commands.user) &&
  fs.lstatSync(commands.user).isDirectory()
)
  defaultsCliCommands.userDir = commands.user;

if (commands.hasOwnProperty("verbose") && typeof commands.verbose === "boolean")
  defaultsCliCommands.logging = {
    enabled: true,
    level: LogLevel.VERBOSE,
  };

new EcoFlow({ cli: defaultsCliCommands }).start();