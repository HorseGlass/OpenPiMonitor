import { fetchPiData } from "../core/shell";
import fs from 'fs';

type CacheValue = string | number | undefined;

interface CacheStore {
  uid: string;
  date: Date;
  mainType: string;
  subType: string;
  value: CacheValue;
}

type CacheInstance = CacheStore[];

export class Cache {
  logType: string;
  interval: number;
  writeToFile: boolean;
  maxLogs: number;
  clearOnStart: boolean;

  private CacheData: CacheInstance[] = [];

  constructor(logt: string, interval?: number, write?: boolean, max?: number, clear?: boolean) {
    this.writeToFile = write || false;
    this.maxLogs = max || 10;
    this.logType = logt;
    this.interval = interval || 1000 * 1;
    this.clearOnStart = clear || false;

    setInterval(this.cache, this.interval);
    if (this.clearOnStart || fs.existsSync(`${__dirname}/static/data/${this.logType}.openpm`)) fs.closeSync(fs.openSync(`${__dirname}/static/data/${this.logType}.openpm`, "w"));
  }

  private cache = () => {
    let shifted = false;
    if (this.CacheData.length + 1 > this.maxLogs) shifted = true;
    if (shifted) this.CacheData.shift();
    fetchPiData(this.logType).then(data => {
      let instanceCache: CacheInstance = [];
      for (const [key, value] of Object.entries(data)) {
        const newData: CacheStore = {uid: '_' + Math.random().toString(36).slice(2, 9), date: new Date(), mainType: this.logType, subType: key, value: value}
        instanceCache.push(newData);
      }
      this.CacheData.push(instanceCache);
      if (this.writeToFile) {
        const path = `${__dirname}/static/data/${this.logType}.openpm`
        if (!fs.existsSync(path)) fs.closeSync(fs.openSync(path, "w"));
        if (shifted) {
          const lines = fs.readFileSync(path).toString().split("\n");
          lines.shift();
          fs.writeFileSync(path, lines.join("\n"))
        }
        fs.appendFileSync(path, `${JSON.stringify(instanceCache)}\n`);
      }
    }).catch(data => {
      console.log(`err: ${data}`);
    });
  };

  getCacheData = (index?:number) => {
    if (index) return this.CacheData[index];
    return this.CacheData;
  };
}