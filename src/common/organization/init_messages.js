`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');

////////////////////init messages////////////////////////////////
function initStartingMessage() {
  console.log(chalk.green('Initializing a new project.... '))
}

function initEndingMessage() {
    console.log(chalk.green('Initialized'))
}

function alreadyInitializedMessage() {
  console.log(chalk.green('A Proxima Project is already initialized here.'))
}

module.exports = {
  INIT_STARTING_MESSAGE: initStartingMessage, INIT_ENDING_MESSAGE: initEndingMessage, ALREADY_INITIALIZED_MESSAGE: alreadyInitializedMessage
};
