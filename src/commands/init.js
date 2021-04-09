`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');
const msg = require('../common/organization/init_messages.js');
const appConfigTemplate = yaml.safeLoad(fse.readFileSync(require.resolve("../common/templates/config-init-template.yml")));
const proximaConfigTemplate = yaml.safeLoad(fse.readFileSync(require.resolve('../common/templates/proximaConfigTemplate.yml')))
const {updateState, getAppState} = require("../common/config/proximaConfig.js")


/*
Init folders:
- abi
- schema
- application_config.yml
- .proxima.yml (shows the file organization)
*/
async function init(project_name) {
  if (isInitialized()) {
    msg.ALREADY_INITIALIZED_MESSAGE()
  } else  {
    msg.INIT_STARTING_MESSAGE();
    initProject(project_name);
    msg.INIT_ENDING_MESSAGE();
}
}

function initProject(project_name) {
  let folders = initProjectFolders(project_name)
  let location = "./" + project_name + "/"
  writeConfig(location, project_name, folders.schema, folders.abi);
}

function initProjectFolders(project_name) {
  let directory = project_name || ".";
  let parent = path.dirname(__filename).split(path.sep).pop();
  if (parent == directory) {
    directory = ".";
  }
  fse.ensureDirSync(directory + "/schema")
  fse.ensureDirSync(directory + "/abi")
  return {schema: directory + "/schema", abi: directory + "/abi"}
}

function writeConfig(location, project_name, schemaDir, abiDir) {
  let appConfig = appConfigTemplate;
  appConfig.name = project_name;
  appConfig.version = "0.0.1"
  appConfig.schema.dir = schemaDir
  appConfig.schema.file = "./schema/schema.graphql"
  fse.writeFileSync(schemaDir + "/schema.graphql", "");
  //appConfig.abi.dir = abiDir
  let appConfigText = yaml.safeDump(appConfig)
  fse.writeFileSync(location + "app-config.yml", appConfigText);

  let proximaConfig = proximaConfigTemplate;
  proximaConfig.name = project_name;
  proximaConfig.app_config = "app-config.yml"
  let proximaConfigText = yaml.safeDump(proximaConfig)
  fse.writeFileSync(location + ".proxima.yml", proximaConfigText);
}

function isInitialized() {
  return  fse.existsSync("./.proxima.yml")
}

module.exports = {name: "init [project_name]", fn: init, description: "Initiatlize the project at the correct directory, with the config file, and folders for abi."};
