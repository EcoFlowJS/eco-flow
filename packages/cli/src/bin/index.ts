#! /usr/bin/env node
import fs from "fs";
import { ICommand } from "@ecoflow/types";
import { CommanderCli } from "../index.js";
import { LogLevel } from "@ecoflow/utils/logger";
import { has } from "lodash";

/**
 * Instantiates a new instance of the CommanderCli class.
 * @returns {CommanderCli} A new instance of the CommanderCli class.
 */
const Commander = new CommanderCli();

/**
 * Parses the command line arguments using Commander and returns the parsed arguments.
 * @returns The parsed command line arguments.
 */
const commands = Commander.usesMsgs(
  `[-?] [-h] [--config settings.js]
               [--port PORT] [--auth] [--dev] [--local]

       ecoflow admin <command> [args] [-?] [--userDir DIR] [--json]`
).parseArgs().args;

/**
 * Checks if a given key exists in the commands object.
 * @param {string} key - The key to check for existence in the commands object.
 * @returns {boolean} True if the key exists in the commands object, false otherwise.
 */
const issetCommand = (key: string) => has(commands, key);
const isAdminCommand = issetCommand("_admin");

/**
 * Check if the command is an admin command and exit the process if it is.
 * @param {boolean} isAdminCommand - Flag indicating if the command is an admin command.
 * @returns None
 */
if (isAdminCommand) {
  // TODO: Add support for admin commands in the future for now just console logging the commands.
  console.log("Admin command executated successfully");
  console.log(commands);
  process.exit(0);
}

/**
 * An object that serves as the prototype for the ICommand interface, providing default CLI commands.
 * @type {ICommand}
 */
const defaultsCliCommands: ICommand = Object.create({});

/**
 * Checks if the "host" command is set and of type string, then assigns it to defaultsCliCommands.Host.
 * @param {string} issetCommand - A function that checks if a command is set.
 * @param {string} commands.host - The value of the "host" command.
 * @returns None
 */
if (issetCommand("host") && typeof commands.host === "string")
  defaultsCliCommands.Host = commands.host;

/**
 * Checks if the command "port" is set and if its value is a valid number, then assigns
 * the parsed integer value to defaultsCliCommands.Port.
 * @param {string} issetCommand - A function that checks if a command is set.
 * @param {object} commands - An object containing the commands and their values.
 * @param {object} defaultsCliCommands - An object containing default CLI commands.
 * @returns None
 */
if (issetCommand("port") && typeof parseInt(commands.port) === "number")
  defaultsCliCommands.Port = parseInt(commands.port);

/**
 * Checks if the "auth" command is set and its type is boolean, then assigns it to defaultsCliCommands.auth.
 * @param {string} issetCommand - A function that checks if a command is set.
 * @param {boolean} commands.auth - The value of the "auth" command.
 * @returns None
 */
if (issetCommand("auth") && typeof commands.auth === "boolean")
  defaultsCliCommands.auth = commands.auth;

/**
 * Checks if the "dev" command is set and its type is boolean, then assigns it to defaultsCliCommands.dev.
 * @param {string} issetCommand - A function that checks if a command is set.
 * @param {boolean} commands.auth - The value of the "dev" command.
 * @returns None
 */
if (issetCommand("dev") && typeof commands.dev === "boolean")
  defaultsCliCommands.dev = commands.dev;

/**
 * Checks if the "config" command is set, is a string, exists as a directory, and then sets it as the default value.
 * @returns None
 */
if (
  issetCommand("config") &&
  typeof commands.config === "string" &&
  fs.existsSync(commands.config)
)
  defaultsCliCommands.config = commands.config;

/**
 * Checks if the "local" command is set and is of type string, then assigns it to defaultsCliCommands.configName.
 * @param {string} issetCommand - A function that checks if a command is set.
 * @param {object} commands - An object containing the commands.
 * @param {object} defaultsCliCommands - An object containing the default CLI commands.
 * @returns None
 */
if (issetCommand("local") && typeof commands.local === "boolean")
  defaultsCliCommands.local = commands.local;

/**
 * Checks if the "verbose" command is set and its value is a boolean. If both conditions are met,
 * sets the logging configuration to enable verbose logging with the level set to VERBOSE.
 * @param {string} issetCommand - A function that checks if a command is set.
 * @param {object} commands - An object containing the commands and their values.
 * @param {object} defaultsCliCommands - The default CLI commands configuration object.
 * @param {enum} LogLevel - An enumeration of log levels.
 * @returns None
 */
if (issetCommand("verbose") && typeof commands.verbose === "boolean")
  defaultsCliCommands.logging = {
    enabled: true,
    level: LogLevel.VERBOSE,
  };

/**
 * Starts the Commander CLI service with the provided default CLI commands.
 * @param {defaultsCliCommands} defaultsCliCommands - The default CLI commands to start the service with.
 * @returns None
 */
Commander.CliService.startService(defaultsCliCommands);
