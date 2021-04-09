`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');

////////////////////init messages////////////////////////////////
function runStartingMessage() {
  console.log(chalk.green('Generating project files....'))
}

function runEndingMessage() {
    console.log(chalk.green('Project Generated.'))
}

function runErrorMessage() {
  console.log(chalk.green('A Proxima project needs to be built here.'))
}

module.exports = {
  RUN_STARTING_MESSAGE: runStartingMessage, RUN_ENDING_MESSAGE: genEndingMessage, RUN_ERROR_MESSAGE: runErrorMessage
};
