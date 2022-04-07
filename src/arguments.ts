import * as ArgumentParser from './args/args';

const InputTypes = {
  Num: typeof(0),
  Str: typeof("a"),
  Swtch: typeof(true)
}

export const ApplicationArguments: Map<string, ArgumentParser.ArgumentTemplate> = new Map([
  ['port', {
    "command": "port",
    "description": "The port that the API opens to",
    "default": "3000",
    "inputType": InputTypes.Num
  }],
  ['help', {
    "command": "help",
    "description": "Displays the command list",
    "inputType": InputTypes.Swtch
  }],
  ["log", {
    "command": "log",
    "description": "Logs request in the console",
    "inputType": InputTypes.Swtch,
    "default": "true"
  }],
  ["logfile", {
    "command": "logfile",
    "description": "Writes logs to a file",
    "inputType": InputTypes.Swtch,
    "default": "false"
  }],
  ["logresp", {
    "command": "logresp",
    "description": "Logs the request's response time in ms",
    "inputType": InputTypes.Swtch,
    "default": "false"
  }],
  ["clearlog", {
    "command": "clearlog",
    "description": "Deletes the content of the log file",
    "inputType": InputTypes.Swtch,
  }]
]);

export function parseBool(raw: string) {
  if (raw.toString().toLowerCase() == "true") {
    return true;
  } else if (raw.toString().toLowerCase() == "false") {
    return false;
  }
}