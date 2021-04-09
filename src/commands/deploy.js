
`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');


async function deploy() {
  msg.DEPLOY_STARTING_MESSAGE();
  if (canDeploy()) {
    console.log("Not implemented.")
  }  else {
    msg.DEPLOY_ERROR_MSG()
  }
}

/*
App Config from proxima
*/
function canDeploy() {
  //pregeneration
  //schema
  //abi + datasources
  //
  return (getAppState() == "Built")
}



module.exports = {name: "deploy", fn: deploy, description: "Deploy the app to the Proxima node."};
