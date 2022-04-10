import fs from 'fs';

const defaultJsonData: object = {
  port: 3000,
  log: {
    enable: false,
    write: false,
    responsetime: false,
    clearonstart: false
  },
  cache: {
    enable: false,
    write: false,
    maxcache: 10,
    interval: 5000
  }
}

export class ArgumentManager {
  parsedArguments: object;

  constructor() {
    if (!fs.existsSync(`${process.cwd()}/openpimonitor.json`)) fs.writeFileSync(`${process.cwd()}/openpimonitor.json`, JSON.stringify(defaultJsonData));
    
    this.parsedArguments = JSON.parse(JSON.stringify(fs.readFileSync(`${process.cwd()}/openpimonitor.json`)));
  }

  getArgument = (name: string) => {
    return (this.parsedArguments as any)[name] || (defaultJsonData as any)[name];
  }
}
