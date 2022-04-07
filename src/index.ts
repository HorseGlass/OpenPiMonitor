import express from 'express';
import chalk from 'chalk';
import figlet from 'figlet';
import * as ArgumentParser from './args/args';
import * as Arguments from './arguments';
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
  ArgManager = new ArgumentParser.ArgumentManager(process.argv.splice(2), Arguments.ApplicationArguments);
  port = +ArgManager.getArgument("port");
  enableLog = Arguments.parseBool(ArgManager.getArgument("log")) || false;
  writeToFile = Arguments.parseBool(ArgManager.getArgument("logfile")) || false;
  printRespTime = Arguments.parseBool(ArgManager.getArgument("logresp")) || false;
  if(Arguments.parseBool(ArgManager.getArgument("clearlog")) || false) Logger.clearFile();
  LogManager = new Logger(writeToFile, printRespTime);
}

Initialize();

app.get('/:maintype', function (request, result) {
  const getStart = performance.now();
  fetchPiData(request.params.maintype).then(data => {
    result.json(data);
    if (enableLog) LogManager.logRequest(200, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  }).catch(() => {
    result.sendStatus(404);
    if (enableLog) LogManager.logRequest(404, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  });
});

app.get('/:maintype/:subtype', function (request, result) {
  const getStart = performance.now();
  fetchPiData(request.params.maintype, request.params.subtype).then(data => {
    result.json(data);
    if (enableLog) LogManager.logRequest(200, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
  }).catch(() => {
    result.sendStatus(404);
    if (enableLog) LogManager.logRequest(404, request.url.toString(), Math.round(((performance.now() - getStart) + Number.EPSILON) * 100) / 100);
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