'use strict'
const fs = require('fs-extra');
const yaml = require('js-yaml');
const proximaConfigTemplate = yaml.safeLoad(fs.readFileSync(require.resolve('../templates/proximaConfigTemplate.yml')))
//write config
function writeProximaConfig(location = "./.proxima.yml", file = proximaConfigTemplate) {
  fs.outputFile(location, file, err => {});
}

//find config file
function readProximaConfig() {
  let fileName = "./.proxima.yml"
  return yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
}

function getAppConfig() {
  let proximaConfig = readProximaConfig()
  let appConfig = yaml.safeLoad(fs.readFileSync(proximaConfig.app_config, 'utf8'))
}

function getAppState() {
  let proximaConfig = readProximaConfig()
  return proximaConfig.state
}


function updateState(newState) {
  //checkAppState
  let proximaConfig = readProximaConfig()
  proximaConfig.state = newState
  let configText  = yaml.safeDump(proximaConfig)
  fs.outputFileSync("./.proxima.yml", configText)
}

module.exports = {updateState, getAppState}
