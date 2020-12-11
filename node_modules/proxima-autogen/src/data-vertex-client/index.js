const chalk = require('chalk');
const fs = require('fs-extra');

'use strict'

const packageTemplate = "";
const typescriptClientTemplate = "";
const generateProximaBash = "";

function generateProximaVertexClient(config) {
  fs.ensureDirSync('./proxima-client')
  fs.copySync('./schema/', './proxima-client/schema')
  packageTemplate.name = config.name
  packageTemplate.version = config.versions
  fs.writeFileSync('./proxima-client/package.json', packageTemplate)
  fs.writeFileSync('./proxima-client/proxima-client-init.sh', generateProximaBash)
  shell.exec('sh ./proxima-client/proxima-client-init.sh')
  fs.copySync('./app-config.yml', './proxima-client/app-config.yml')
  fs.writeFileSync('./proxima-client/index.js', typescriptClientTemplate)
}

module.exports = generateProximaVertexClient
