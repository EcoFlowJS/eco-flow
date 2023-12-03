import {
  ChildProcess,
  SpawnOptions,
  SpawnOptionsWithStdioTuple,
  SpawnOptionsWithoutStdio,
  StdioNull,
  StdioPipe,
  spawn,
} from "child_process";
import { EventEmitter } from "stream";

export default (
  command: string,
  args: string[],
  options:
    | SpawnOptionsWithoutStdio
    | SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>
    | SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>
    | SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>
    | SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>
    | SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>
    | SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>
    | SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>
    | SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>
    | SpawnOptions
): IinstallPackageHelper => {
  const event = new EventEmitter();
  const spawnProcess = spawn(command, args, options);
  spawnProcess.stdout?.on("data", (data) => event.emit("stdout:data", data));
  spawnProcess.stdout?.on("close", (data: any) =>
    event.emit("stdout:close", data)
  );
  spawnProcess.stdout?.on("end", (data: any) => event.emit("stdout:end", data));
  spawnProcess.stdout?.on("error", (data) => event.emit("stdout:error", data));
  spawnProcess.stdout?.on("pause", (data: any) =>
    event.emit("stdout:pasue", data)
  );
  spawnProcess.stdout?.on("readable", (data: any) =>
    event.emit("stdout:readable", data)
  );
  spawnProcess.stdout?.on("resume", (data: any) =>
    event.emit("stdout:resume", data)
  );

  spawnProcess.stderr?.on("data", (data) => event.emit("stderr:data", data));
  spawnProcess.stderr?.on("close", (data: any) =>
    event.emit("stderr:close", data)
  );
  spawnProcess.stderr?.on("end", (data: any) => event.emit("stderr:end", data));
  spawnProcess.stderr?.on("error", (data) => event.emit("stderr:error", data));
  spawnProcess.stderr?.on("pause", (data: any) =>
    event.emit("stderr:pasue", data)
  );
  spawnProcess.stderr?.on("readable", (data: any) =>
    event.emit("stderr:readable", data)
  );
  spawnProcess.stderr?.on("resume", (data: any) =>
    event.emit("stderr:resume", data)
  );

  return {
    process: spawnProcess,
    event: event,
    stdout: spawnProcess.stdout,
    stderr: spawnProcess.stderr,
    stdin: spawnProcess.stdin,
    stdio: spawnProcess.stdio,
  };
};

export interface IinstallPackageHelper {
  process: ChildProcess;
  event: EventEmitter;
  stdout: ChildProcess["stdout"];
  stderr: ChildProcess["stderr"];
  stdin: ChildProcess["stdin"];
  stdio: ChildProcess["stdio"];
}
