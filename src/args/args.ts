import chalk from 'chalk';

export interface ArgumentTemplate {
  command: string;
  description: string;
  default?: string;
  inputType: any;
}

interface Argument {
  base: ArgumentTemplate;
  value: any;
}

export class ArgumentManager {
  rawArguments: string[];
  argumentList: Map<string, ArgumentTemplate>;
  parsedArguments: Map<string, Argument>;

  constructor(rawArgs: string[], argList: Map<string, ArgumentTemplate>) {
    this.rawArguments = rawArgs;
    this.argumentList = argList;
    this.parsedArguments = new Map();

    for (let i = 0; i < this.rawArguments.length; i++) {
      let argument: string = this.rawArguments[i];
      if ( !(argument.startsWith("-")) || ([...argument.matchAll(/=/g)] || []).length > 1 ) {
        continue;
      }
      argument = argument.replace(/-/g, '');
      let argumentCommand: string = argument.split("=")[0];
      if (argumentCommand == "help") {
        this.printHelpArguments();
        process.exit();
      }
      if (this.argumentList.get(argumentCommand) == undefined) {
        this.printHelpArguments();
        console.log(chalk.red(`${argumentCommand} is not a valid argument`));
        process.exit();
      }
      let argumentValue: any = true;
      if (argument.includes("=")) {
        argumentValue = argument.split("=")[1];
      }
      this.parsedArguments.set(argumentCommand, {base: this.argumentList.get(argumentCommand) || {command: "", inputType: "", description: "", default: ""}, value: argumentValue});
    }
  }

  getArgument(base: string): any {
    if (this.parsedArguments.get(base)?.value != undefined)
      return this.parsedArguments.get(base)?.value;
    return this.argumentList.get(base)?.default;
  }

  printHelpArguments() {
    console.log(`${chalk.blue("OpenPiMonitor")}\n${chalk.bgGreen.black("\nValid passable arguments")}`)
    this.argumentList.forEach((value: ArgumentTemplate) => {
      let defaultExtra = "";
      if (value.default) {
        defaultExtra = `\n\tDefault: ${value.default}`;
      }
      console.log(`${chalk.green(`  --${value.command}`)}: ${value.description}${defaultExtra}`);
    });
  }
}