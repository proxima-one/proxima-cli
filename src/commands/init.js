`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');
const AppConfigTemplate = require("../common/templates/config-init-template.yml");


/*
Init folders:
- abi
- schema
- application_config.yml
- .proxima.yml (shows the file organization)
*/
async function init(project_name) {
  if (isInitialized()) {
    ALREADY_INITIALIZED_MESSAGE()
  } else  {
    INIT_STARTING_MESSAGE();
    initProject(project_name);
    INIT_ENDING_MESSAGE();
}
}

function initProject(project_name) {
  initProjectFolders(project_name)
  let location = "./" + project_name + "/"
  writeProximaConfig(location + ".proxima.yml")
  writeAppConfig(location, project_name);
}

function initProjectFolders(project_name) {
  let config = createGenerationConfigFile();
  let directory = project_name || ".";
  let parent = path.dirname(__filename).split(path.sep).pop();
  if (parent == directory) {
    directory = ".";
  }
  fse.ensureDirSync(directory + "/schema")
  fse.ensureDirSync(directory + "/abi")
}

function writeAppConfig(location, project_name) {
  let appConfig = yaml.safeLoad(fs.readFileSync("../common/templates/config-init-template.yml", 'utf8'));
  appConfig.name = project_name
  fse.outputFile(location + "app-config.yml", appConfig);
}

function isInitialized() {
  return fse.existsSync("./.proxima.yml")
}

module.exports = {name: "init [project_name]", function: init, description: "Initiatlize the project at the correct directory, with the config file, and folders for abi."};
