import express from 'express';
import chalk from 'chalk';
import figlet from 'figlet';
import * as ArgumentParser from './args/args';
import * as Arguments from './arguments';
import { fetchPiData } from './core/shell';

const app = express();

let port: number = 3000;

let ArgManager: ArgumentParser.ArgumentManager;

function Initialize() {
  ArgManager = new ArgumentParser.ArgumentManager(process.argv.splice(2), Arguments.ApplicationArguments);
  port = +ArgManager.getArgument("port");
}

Initialize();

app.get('/:maintype', function (request, result) {
  fetchPiData(request.params.maintype).then(data => {
    result.json(data);
  });
});

app.get('/:maintype/:subtype', function (request, result) {
  fetchPiData(request.params.maintype, request.params.subtype).then(data => {
    result.json(data);
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