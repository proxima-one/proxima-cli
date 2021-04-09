`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');

////////////////////init messages////////////////////////////////
function genStartingMessage() {
  console.log(chalk.green('Generating project files....'))
}

function genEndingMessage() {
    console.log(chalk.green('Project Generated.'))
}

function genErrorMessage() {
  console.log(chalk.green('A Proxima project needs to be initialized here.'))
}

module.exports = {
  GEN_STARTING_MESSAGE: genStartingMessage, GEN_ENDING_MESSAGE: genEndingMessage, GEN_ERROR_MSG: genErrorMessage
};
