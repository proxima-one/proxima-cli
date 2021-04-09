`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');

////////////////////init messages////////////////////////////////
function runStartingMessage() {
  console.log(chalk.green('Benchmarking proxima project.... '))
}

function runEndingMessage() {
    console.log(chalk.green('Project Benchmarked'))
}

function runErrorMessage() {
  console.log(chalk.green('A Proxima project needs to be built here.'))
}

module.exports = {
  BENCHMARK_STARTING_MSG: runStartingMessage, BENCHMARK_ENDING_MSG: runEndingMessage,
  BENCHMARK_ERROR_MSG: runErrorMessage
};
