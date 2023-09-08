#! /usr/bin/env node
import { CommanderCli } from "./lib/CommanderCli";

console.log(new CommanderCli().parseArgs().commands);