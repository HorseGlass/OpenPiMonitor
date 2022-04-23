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
    interval: 5000,
    clearonstart: false,
    categories: []
  },
  webinterface: false
}

const acceptedCacheCategories = {
  cpu: true,
  gpu: true,
  memory: true,
  storage: true,
  network: true
}

export class ArgumentManager {
  parsedArguments: object;

  constructor() {
    if (!fs.existsSync(`${process.cwd()}/openpimonitor.json`)) fs.writeFileSync(`${process.cwd()}/openpimonitor.json`, JSON.stringify(defaultJsonData, null, 4));
    
    let tempParse = JSON.parse(fs.readFileSync(`${process.cwd()}/openpimonitor.json`).toString());
    let tempCategories: any[] = [];
    let categoryArray = (tempParse as any)["cache"]["categories"] || (defaultJsonData as any)["cache"]["categories"];
    
    categoryArray.forEach((element: any) => {
      if ((acceptedCacheCategories as any)[element]) {
        tempCategories.push(element);
      }
    });
    tempParse["cache"]["categories"] = tempCategories;
    
    this.parsedArguments = tempParse;
  }

  getArgument = (name: string) => {
    return (this.parsedArguments as any)[name] || (defaultJsonData as any)[name];
  }
}
