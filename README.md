# EcoFlowJS

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/EcoFlowJS/eco-flow/blob/main/LICENSE)

Low-code programming for RESTful APIs deployment.

## Quick Start

This guide will help you get EcoFlowJS installed and running in just a few minutes.

### Prerequisites

To install EcoFlowJS locally you will need a [supported version of Node.js](https://nodejs.org/en/download).

### Installing with npm

To install EcoFlowJS you can use the `npm` command that comes with node.js:

```bash
  sudo npm install -g @ecoflow/cli@latest
```

If you are using Windows, do not start the command with `sudo`.

That command will install EcoFlowJS as a global module along with its dependencies.

## Running

Once installed as a global module you can use the `ecoflow` command to start EcoFlowJS in your terminal. You can use `Ctrl-C` or close the terminal window to stop EcoFlowJS.

```bash
$ ecoflow
```

Terminal output

```
[ 29-5-2024 22:05:26 ] : [ EcoFlow ] : Starting up EcoFlow services
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : ====================================
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : Starting Application....
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : Adding Databaase Connection _sysDB
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : Databaase Connection Added named : _sysDB
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : System DataBase Connection Successfully
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : Installing default modules using ecoModule
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : Initializing the existing flow...
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : Server listening on http://127.0.0.1:4000
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : ====================================
[ 29-5-2024 22:05:27 ] : [ Eco-FLow ] | [ info ] : Server Ready to use!!!
```

You can then access the EcoFlowJS editor by pointing your browser at http://127.0.0.1:4000.

The log output provides you various pieces of information:

- The versions of EcoFlowJS and Node.js
- Any errors hit when it tried to load the nodes
- The usernames of the connected users.

## Developers

If you want to run the latest code from git, here's how to get started:

### Clone the project

Clone the project

```bash
  git clone https://github.com/EcoFlowJS/eco-flow.git
```

or clone recursively submodules.

```bash
  git clone --recurse-submodules https://github.com/EcoFlowJS/eco-flow.git
```

### Go to the project directory

```bash
  cd eco-flow
```

### Install dependencies

```bash
  npm install --legacy-peer-deps
```

### Install dependencies

```bash
  npm install --legacy-peer-deps
```

### Build the project

```bash
  npm run build
```

### Start the server

Start the backend

```bash
  npm run dev:backend
```

Start the frontend

```bash
  npm run frontend
```

\*_Note: This command will only works cloning submodules._

## Command-line Usage

EcoFlowJS can be started using the command ecoflow. This command can take various arguments:

```bash
$ ecoflow [-?] [-h] [--configName config.json] [--userDir DIR] [--port PORT]

# Still under developement.
$ecoflow admin <command> [args] [-?] [--userDir DIR] [--json]
```

### Basic commands

| Options         | Type      | Description                                                       | Default     |
| :-------------- | :-------- | :---------------------------------------------------------------- | :---------- |
| `-h, --host`    | `string`  | **Optional**. Sets the TCP address of the server.                 | `127.0.0.1` |
| `-p, --port`    | `string`  | **Optional**. Sets the TCP port the runtime listens on.           | `4000`      |
| `--auth`        | `boolean` | **Optional**. Enable authentication mode for user authentication. | `false`     |
| `-D, --dev`     | `boolean` | **Optional**. Enable developement mode.                           | `false`     |
| `-u, --user`    | `string`  | **Optional**. Sets the user directory of the runtime.             | `$HOME`     |
| `-v, --verbose` | `boolean` | **Optional**. Enable verbose output.                              | `false`     |
| `-V, --version` | `boolean` | **Optional**. Display the version of the runtime.                 |             |
| `-?, --help`    | `boolean` | **Optional**. Display the available commands.                     |             |

### Admin commands

`Yet to be implemented.`

## Upgrading EcoFLowJS

If you have installed EcoFLowJS as a global npm package, you can upgrade to the latest version with the following command:

```bash
sudo npm install -g @ecoflow/cli@latest
```

If you are using Windows, do not start the command with `sudo`.

## Documentation

- [EcoFlowJS/Api](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/api/README.md)
- [EcoFlowJS/Cli](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/cli/README.md)
- [EcoFlowJS/Database](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/database/README.md)
- [EcoFlowJS/Ecoflow](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/ecoflow/README.md)
- [EcoFlowJS/Flows](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/flows/README.md)
- [EcoFlowJS/Helper](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/helper/README.md)
- [EcoFlowJS/Module](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/module/README.md)
- [EcoFlowJS/Services](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/services/README.md)
- [EcoFlowJS/Types](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/types/README.md)
- [EcoFlowJS/Utils](https://github.com/EcoFlowJS/eco-flow/blob/main/packages/utils/README.md)

## Creating Nodes

The main way EcoFFlowJS can be extended is to add new nodes into its packages.

Nodes can be published as npm modules to the [public npm repository](https://www.npmjs.com/) to make them available to the community or can a zip containg the packages.

### Documentation

- [Creating your first node]()
- [Node properties]()
- [Node credentials]()
- [Node appearance]()
- [Node status]()
- [Configuration nodes]()
- [Adding examples]()
- [Publishing nodes]()

### General guidance

There are some general principles to follow when creating new nodes. These reflect the approach taken by the core nodes and help provided a consistent user-experience.

Nodes should:

- **be well-defined in their purpose.**

  A node that exposes every possible option of an API is potentially less useful that a group of nodes that each serve a single purpose.

- **be simple to use, regardless of the underlying functionality.**

  Hide complexity and avoid the use of jargon or domain-specific knowledge.

- **be forgiving in what types of message properties it accepts.**

  Message properties can be strings, numbers, booleans, Buffers, objects, arrays or nulls. A node should do The Right Thing when faced with any of these.

- **be consistent in what they send.**

  Nodes should document what properties they add to messages, and they should be consistent and predictable in their behaviour.

- **catch errors.**

  If a node throws an uncaught error, EcoFlowJS will stop the entire flow as the state of the system is no longer known.

  Wherever possible, nodes must catch errors or register error handlers for any asynchronous calls they make.

## Contributing

Before raising a pull-request, please read our [contributing guide](https://github.com/EcoFlowJS/eco-flow/blob/main/CONTRIBUTING.md).

This project adheres to the [Contributor Covenant 2](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior to any of the project's core team at teams.ecoflow@gmail.com.

## Support

For support, email teams.ecoflow@gmail.com or join our [Slack channel](https://join.slack.com/t/ecoflowjs/shared_invite/zt-2jpm9657q-dmugTuLg_udxo9jTtnwZjA).

## Feedback

If you have any feedback, please reach out to us at teams.ecoflow@gmail.com

## License

[MIT](https://github.com/EcoFlowJS/eco-flow/blob/main/LICENSE)

## Authors

- [@EcoFlowJS](https://github.com/EcoFlowJS)
- [@Romel Sikdar](https://github.com/RomelSikdar)
