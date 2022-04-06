import { exec, spawn } from "child_process";

export function utilExecCommand(command: string, args: string[], callback: any, errorcallback: any): void {
  let execution = spawn(command, args);
  let executionData: string = "";
  execution.stdout.on('data', function (data) {
    executionData += `${data.toString()} `;
  });
  execution.stderr.on('data', function (data) {
    errorcallback(data.toString());
  });
  execution.on('exit', function () {
    callback(executionData);
  })
}