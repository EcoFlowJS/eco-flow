#! /usr/bin/env node
import fs from "fs";
import { ICommand } from "@eco-flow/types";
import { CommanderCli } from "@eco-flow/cli";
import { EcoFlow } from "@eco-flow/core";
import { LogLevel } from "@eco-flow/utils";
import { has } from "lodash";

let commands = new CommanderCli().parseArgs().args;
let issetCommand = (key: string) => has(commands, key);
let isAdminCommand = issetCommand("_admin");

if (isAdminCommand) {
  // TODO: Add support for admin commands in the future for now just console logging the commands.
  console.log("Admin command executated successfully");
  console.log(commands);
  process.exit(0);
}

let defaultsCliCommands: ICommand = {};

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

new EcoFlow({ cli: defaultsCliCommands }).start();