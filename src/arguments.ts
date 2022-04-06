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
  }]
]);