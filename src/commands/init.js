`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');


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
  writeFolders("./", project_name, INIT_FOLDER_ORG);
}

function isInitialized() {
  //check for a .ProximaFile
  return false;
}

module.exports = {name: "init [project_name]", function: init, description: "Initiatlize the project at the correct directory, with the config file, and folders for abi."};
