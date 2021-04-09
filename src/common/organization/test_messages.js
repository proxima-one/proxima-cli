`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');

////////////////////init messages////////////////////////////////
function runStartingMessage() {
  console.log(chalk.green('Testing project....'))
}

function runEndingMessage() {
    console.log(chalk.green('Project Tested.'))
}

function runErrorMessage() {
  console.log(chalk.green('A Proxima project needs to be built here.'))
}

module.exports = {
  TEST_STARTING_MESSAGE: runStartingMessage, TEST_ENDING_MESSAGE: genEndingMessage, TEST_ERROR_MESSAGE: runErrorMessage
};
