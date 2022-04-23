import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import chalk from 'chalk';
import figlet from 'figlet';
import * as ArgumentParser from './args/args';
import { Logger } from './log/log';
import { fetchPiData } from './core/shell';
import { Cache } from './web/cache';
import { InitializeInterface } from './web/web';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let port: number = 3000;
let enableLog: boolean = false;
let enableCache: boolean = false;

let ArgManager: ArgumentParser.ArgumentManager;
let LogManager: Logger;
let CacheManagers: Cache[] = [];

function Initialize() {
  ArgManager = new ArgumentParser.ArgumentManager();
  port = +ArgManager.getArgument("port");
  
  // logging
  enableLog = ArgManager.getArgument("log")["enable"];
  if (ArgManager.getArgument("log")["clearonstart"]) Logger.clearFile();
  LogManager = new Logger(ArgManager.getArgument("log")["write"], ArgManager.getArgument("log")["responsetime"]);

  // chaching
  enableCache = ArgManager.getArgument("cache")["enable"];
  if (enableCache) {
    for (const value of ArgManager.getArgument("cache")["categories"]) {
      CacheManagers.push(new Cache(value, ArgManager.getArgument("cache")["interval"], ArgManager.getArgument("cache")["write"], ArgManager.getArgument("cache")["maxcache"]), ArgManager.getArgument("cache")["clearonstart"]);
    }
  }

  if (ArgManager.getArgument("webinterface")) {
    InitializeInterface(app, io, ArgManager.getArgument("cache"));
  }
}

Initialize();

app.get('/api/:maintype', function (request, result) {
  const getStart = performance.now();
  fetchPiData(request.params.maintype).then(data => {
    result.json(data);
    enableLog || LogManager.logRequest(200, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  }).catch(() => {
    result.sendStatus(404);
    enableLog || LogManager.logRequest(404, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  });
});

app.get('/api/:maintype/:subtype', function (request, result) {
  const getStart = performance.now();
  fetchPiData(request.params.maintype, request.params.subtype).then(data => {
    result.json(data);
    enableLog || LogManager.logRequest(200, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  }).catch(() => {
    result.sendStatus(404);
    enableLog || LogManager.logRequest(404, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  });
});

server.listen(port, () => {
  figlet.text("OpenPiMonitor", function (error, result) {
    if (error)
      return;

    console.log(chalk.blue(result));
    console.log(`\nStarted on port ${chalk.bgGreen.black(port)}`);
  });
});