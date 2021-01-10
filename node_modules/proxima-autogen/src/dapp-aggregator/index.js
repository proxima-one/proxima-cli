
'use strict'

const fs = require('fs-extra');
const yaml = require('js-yaml')

const handlerGen = require('./handler-generator.js');
const { exec } = require("child_process");
////////////////////////////////////////////////////////////////////////
const dockerFileTemplate = (fs.readFileSync(require.resolve('./dockerfile'))).toString()
const aggregatorTemplate = (fs.readFileSync(require.resolve('./templates/dataAggregatorTemplate.js'))).toString()
const packageTemplate = JSON.parse((fs.readFileSync(require.resolve("./templates/packageTemplate.json"))).toString())




function generateHandlers(config) {
  fs.ensureDirSync('./handlers')
  let mainHandlerTemplate = ""
  for (var dSource of config.datasources) {
    let datasource = dSource.datasource
    let outputFolder = "./handlers/" + datasource.name
    let abi = getABI(datasource.source.abi, datasource.contracts)
    let handlers = handlerGen.generateHandlers(abi, outputFolder)
    datasource.handlers = handlers
  }
  let configText = yaml.safeDump(config)
  fs.writeFileSync("./app-config.yml", configText)
}

function getABI(abiName, contracts) {
  for (var contract of contracts) {
    if (contract.name == abiName) {
      return JSON.parse(fs.readFileSync(contract.file, 'utf8').toString());
    }
  }
}

function buildDataAggregator(app_config = {}) {
  let config = app_config
  if (config == {}) {
    config = yaml.safeLoad(fs.readFileSync('./app-config.yml'));
  }

  fs.ensureDirSync('./DataAggregator')
  fs.copySync('./app-config.yml', './DataAggregator/app-config.yml')
  fs.copySync('./handlers/', './DataAggregator/handlers/')
  fs.copySync('./vertex-client/', './DataAggregator/vertex-client/')
  fs.copySync('./blockchain-clients/', './DataAggregator/blockchain-clients/')
  fs.copySync('./abi', './DataAggregator/abi')
  fs.writeFileSync('./DataAggregator/index.js', aggregatorTemplate)
  fs.writeFileSync('./DataAggregator/dockerfile', dockerFileTemplate)
  packageTemplate.name = config.name
  packageTemplate.version = config.versions
  fs.outputFileSync('./DataAggregator/package.json', JSON.stringify(packageTemplate))
  let proximaConfig = yaml.safeLoad(fs.readFileSync('./.proxima.yml'))
  proximaConfig.data_aggregator = "./DataAggregator"
  let proximaConfigText = yaml.safeDump(proximaConfig)
  fs.writeFileSync("./.proxima.yml", proximaConfigText)
  //shell exec in different folders
  //exec("npm install")
}

module.exports = {buildDataAggregator, generateHandlers};
