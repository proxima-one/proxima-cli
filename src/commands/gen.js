
`use strict`
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const generator = require('proxima-autogen')
const msg = require('../common/organization/gen_messages.js');
const yaml = require('js-yaml')
/*
Generate
- Generate Dapp aggregator/eventHandlers from the abi code
*/
async function gen() {
  msg.GEN_STARTING_MESSAGE();
  if (canGenerate()) {
    let config = yaml.safeLoad(fs.readFileSync('./app-config.yml', 'utf8'))
    generateProximaApplication(config);
    msg.GEN_ENDING_MESSAGE();
  }
}

/*
App Config from proxima
*/
function canGenerate() {
  //pregeneration
  //schema
  //abi + datasources
  return true
}



function generateProximaApplication(config) {
  let proximaConfig = yaml.safeLoad(fs.readFileSync('./.proxima.yml', 'utf8'))
  generator.processSchema(config)
  generator.generateApplicationDatabase(config)
  generator.generateProximaVertexClient(config)
  generator.generateHandlers(config)
  generator.generateBlockchainClient(config) //update

  //update the app_config
  let proximaConfigText = yaml.safeDump(proximaConfig);
  fs.writeFileSync("./.proxima.yml", proximaConfigText)
}

module.exports = {name: "gen", fn: gen, description: "Generate the event-handlers from the config."};
