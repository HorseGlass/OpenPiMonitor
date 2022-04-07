import chalk from "chalk";
import fs from 'fs';

export class Logger {
  private writeToFile: boolean;
  private printExecTime: boolean;

  constructor(write: boolean, time: boolean) {
    this.writeToFile = write;
    this.printExecTime = time;
  }

  static clearFile() {
    fs.writeFileSync("./log.txt", "");
  }

  logRequest(code: number, requestURL: string, execTime?: number) {
    console.log(`${code >= 400 ? chalk.bgRed.black(code.toString()) : chalk.bgGreen.black(code.toString())} ${requestURL} ${this.printExecTime ? `| Response time: ${execTime}ms` : ``}`);
    if (this.writeToFile) this.writeFile(`[${new Date()}] ${requestURL} -> ${code.toString()} <- ${execTime}ms\n`);
  }

  private writeFile(text: string) {
    if (!fs.existsSync("./log.txt")) fs.closeSync(fs.openSync("./log.txt", "w"));
    fs.appendFileSync("./log.txt", text);
  }
}