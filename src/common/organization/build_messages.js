`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');

////////////////////init messages////////////////////////////////
function initStartingMessage() {
  console.log(chalk.green('Building proxima project.... '))
}

function initEndingMessage() {
    console.log(chalk.green('Application Built.'))
}


module.exports = {
  BUILD_STARTING_MESSAGE: buildStartingMessage, BUILD_ENDING_MESSAGE: buildEndingMessage
};
