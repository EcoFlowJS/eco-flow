# Command-line Usage

EcoFlowJS can be started using the `ecoflow` command with various arguments:

```bash
ecoflow [-?] [-h] [--configName config.json] [--userDir DIR] [--port PORT]
```

### Basic Commands

| Option          | Type      | Description                                         | Default     |
| :-------------- | :-------- | :-------------------------------------------------- | :---------- |
| `-h, --host`    | `string`  | Optional. Sets the TCP address of the server.       | `127.0.0.1` |
| `-p, --port`    | `string`  | Optional. Sets the TCP port the runtime listens on. | `4000`      |
| `--auth`        | `boolean` | Optional. Enable authentication mode.               | `false`     |
| `-D, --dev`     | `boolean` | Optional. Enable development mode.                  | `false`     |
| `-u, --user`    | `string`  | Optional. Sets the user directory.                  | `$HOME`     |
| `-v, --verbose` | `boolean` | Optional. Enable verbose output.                    | `false`     |
| `-V, --version` | `boolean` | Optional. Display the runtime version.              |             |
| `-?, --help`    | `boolean` | Optional. Display the available commands.           |             |

### Admin Commands

**_Note:_** Currently under development.
