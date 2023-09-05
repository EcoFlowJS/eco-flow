#! /usr/bin/env node

const { Command, Option } = require("commander");
const program = new Command();

program
  .addOption(new Option("-s, --secret").hideHelp())
  .addOption(
    new Option("-t, --timeout <delay>", "timeout in seconds").default(
      60,
      "one minute"
    )
  )
  .addOption(
    new Option("-d, --drink <size>", "drink size").choices([
      "small",
      "medium",
      "large",
    ])
  )
  .addOption(new Option("-p, --port <number>", "port number").env("PORT"))
  .addOption(
    new Option("--donate [amount]", "optional donation in dollars")
      .preset("20")
      .argParser(parseFloat)
  )
  .addOption(
    new Option("--disable-server", "disables the server").conflicts("port")
  )
  .addOption(
    new Option("--free-drink", "small drink included free ").implies({
      drink: "small",
    })
  );

program.parse();

const options = program.opts();

console.log(options);
