#! /usr/bin/env node
import fs from "fs";
import { ICommand } from "@eco-flow/types";
import { CommanderCli } from "../";
import { LogLevel } from "@eco-flow/utils";
import { has } from "lodash";

const Commander = new CommanderCli();
const commands = Commander.usesMsgs(
  `[-?] [-h] [--settings settings.js] [--userDir DIR]
               [--port PORT] [--title TITLE] [--safe] [flows.json]

       ecoflow admin <command> [args] [-?] [--userDir DIR] [--json]`
).parseArgs().args;
const issetCommand = (key: string) => has(commands, key);
const isAdminCommand = issetCommand("_admin");

if (isAdminCommand) {
  // TODO: Add support for admin commands in the future for now just console logging the commands.
  console.log("Admin command executated successfully");
  console.log(commands);
  process.exit(0);
}

const defaultsCliCommands: ICommand = Object.create({});

if (issetCommand("host") && typeof commands.host === "string")
  defaultsCliCommands.Host = commands.host;

if (issetCommand("port") && typeof parseInt(commands.port) === "number")
  defaultsCliCommands.Port = parseInt(commands.port);

if (issetCommand("auth") && typeof commands.auth === "boolean")
  defaultsCliCommands.auth = commands.auth;

if (
  issetCommand("configDir") &&
  typeof commands.configDir === "string" &&
  fs.existsSync(commands.configDir) &&
  fs.lstatSync(commands.configDir).isDirectory()
)
  defaultsCliCommands.configDir = commands.configDir;

if (issetCommand("configName") && typeof commands.configName === "string")
  defaultsCliCommands.configName = commands.configName;

if (
  issetCommand("user") &&
  typeof commands.user === "string" &&
  fs.existsSync(commands.user) &&
  fs.lstatSync(commands.user).isDirectory()
)
  defaultsCliCommands.userDir = commands.user;

if (issetCommand("verbose") && typeof commands.verbose === "boolean")
  defaultsCliCommands.logging = {
    enabled: true,
    level: LogLevel.VERBOSE,
  };
// new EcoFlow({ cli: defaultsCliCommands }).start();

Commander.CliService.startService(defaultsCliCommands);
