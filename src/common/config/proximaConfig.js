'use strict'
const fs = require('fs-extra');
const yaml = require('js-yaml');
const Proxima_Config_Template = require("../common/templates/proximaConfigTemplate.yml")

//write config
function writeProximaConfig(location = "./.proxima.yml", file = Proxima_Config_Templates) {
  fs.outputFile(location, file, err => {});
}

//find config file
function readProximaConfig() {
  let fileName = "./.proxima.yml"
  return yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
}

function getAppConfig() {
  let proximaConfig = readProximaConfig()
  let appConfig = yaml.safeLoad(fs.readFileSync(proximaConfig.app-config, 'utf8'))
}
