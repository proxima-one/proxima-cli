
`use strict`
const fse = require('fs-extra');
const path = require('path');
const { exec } = require("child_process");
//const shell = require('shell')
const {updateState, getAppState} = require("../common/config/proximaConfig.js")

async function run() {
  msg.RUN_STARTING_MSG()
  if (canRun()) {
    let config  = ""
    runDockerApplication(config)
    msg.RUN_ENDING_MSG()
  } else {
    msg.RUN_ERROR_MESSAGE()
  }
}

function runDockerApplication(config) {
  exec("docker-compose build")
exec('docker-compose up', function(code, stdout, stderr) {
  console.log('Exit code:', code);
  console.log('Program output:', stdout);
  console.log('Program stderr:', stderr);
});
}

/*
App Config from proxima
*/
function canRun() {
  //pregeneration
  //schema
  //abi + datasources
  //
  return (getAppState() == "Built")
}

module.exports = {name: "run", fn: run, description: "Run the node, either locally or remotely."};
