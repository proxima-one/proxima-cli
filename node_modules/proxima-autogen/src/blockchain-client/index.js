const chalk = require('chalk');
const fs = require('fs-extra');

'use strict'

const packageTemplate = "";
const mainIndexTemplate = "";

function generateBlockchainClient(config) {
  fs.ensureDirSync('./blockchain-client')
  packageTemplate.name = config.name
  packageTemplate.version = config.versions
  fs.writeFileSync('./blockchain-client/package.json', packageTemplate)
  shell.exec('npm install')
  fs.copySync('./app-config.yml', './blockchain-client/app-config.yml')
  fs.writeFileSync('./blockchain-client/index.js', mainIndexTemplate)
}

module.exports = generateBlockchainClient
