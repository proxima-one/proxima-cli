const Datasource = require('./datasource.js')
const chalk = require('chalk');
const fs = require('fs-extra');
const dockerFileTemplate = require('./dockerfile')
////////////////////////////////////////////////////////////////////////
const aggregatorTemplate = require('./')
const packageTemplate = ""

'use strict'

function generateHandlers(config) {
  fs.ensureDirSync('./handlers')
  //interpreter functions
}

function buildDataAggregator(config) {
  fs.ensureDirSync('./DAppAggregator')
  fs.copySync('./handlers/', './DAppAggregator/handlers/')
  fs.copySync('./proxima-client/', './DAppAggregator/proxima-client/')
  fs.copySync('./app-config.yml', './DAppAggregator/app-config.yml')
  fs.copySync('./blockchain-client/', './DAppAggregator/blockchain-client/')
  fs.copySync('./abi/', './DAppAggregator/abi/')
  packageTemplate.name = config.name
  packageTemplate.version = config.version
  fs.writeFileSync('./DAppAggregator/package.json', packageTemplate)
  shell.exec("npm install")
  fs.writeFileSync('./index.js', aggregatorTemplate)
  fs.writeFileSync('./dockerfile', dockerFileTemplate)
}

module.exports = processSchema;
