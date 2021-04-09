`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');

////////////////////init messages////////////////////////////////
function buildStartingMessage() {
  console.log(chalk.green('Building proxima project.... '))
}

function buildEndingMessage() {
    console.log(chalk.green('Application Built.'))
}

function runErrorMessage() {
  console.log(chalk.green('A Proxima project needs to be built here.'))
}

module.exports = {
  BUILD_STARTING_MESSAGE: buildStartingMessage, BUILD_ENDING_MESSAGE: buildEndingMessage, BUILD_ERROR_MESSAGE: runErrorMessage
};
