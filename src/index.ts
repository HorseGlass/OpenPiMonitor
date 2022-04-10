import express from 'express';
import chalk from 'chalk';
import figlet from 'figlet';
import * as ArgumentParser from './args/args';
import { Logger } from './log/log';
import { fetchPiData } from './core/shell';

const app = express();

let port: number = 3000;
let enableLog: boolean = false;
let writeToFile: boolean = false;
let printRespTime: boolean = false;

let ArgManager: ArgumentParser.ArgumentManager;
let LogManager: Logger;

function Initialize() {
  ArgManager = new ArgumentParser.ArgumentManager();
  port = +ArgManager.getArgument("port");
  enableLog = ArgManager.getArgument("log")["enable"];
  writeToFile = ArgManager.getArgument("log")["write"];
  printRespTime = ArgManager.getArgument("log")["responsetime"];
  if (ArgManager.getArgument("log")["clearonstart"]) Logger.clearFile();
  LogManager = new Logger(writeToFile, printRespTime);
}

Initialize();

app.get('/:maintype', function (request, result) {
  const getStart = performance.now();
  fetchPiData(request.params.maintype).then(data => {
    result.json(data);
    enableLog || LogManager.logRequest(200, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  }).catch(() => {
    result.sendStatus(404);
    enableLog || LogManager.logRequest(404, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  });
});

app.get('/:maintype/:subtype', function (request, result) {
  const getStart = performance.now();
  fetchPiData(request.params.maintype, request.params.subtype).then(data => {
    result.json(data);
    enableLog || LogManager.logRequest(200, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  }).catch(() => {
    result.sendStatus(404);
    enableLog || LogManager.logRequest(404, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  });
});

app.listen(port, () => {
  figlet.text("OpenPiMonitor", function (error, result) {
    if (error)
      return;

    console.log(chalk.blue(result));
    console.log(`\nStarted on port ${chalk.bgGreen.black(port)}`);
  });
});