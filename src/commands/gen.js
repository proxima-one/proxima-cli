
`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
/*
Generate
- Generate Dapp aggregator/eventHandlers from the abi code
*/
async function gen() {
  GEN_STARTING_MESSAGE();
  if (canGenerate()) {
    let config = getApplicationConfig()
    generateProximaApplication(config);
    GEN_ENDING_MESSAGE();
  }
}

/*
App Config from proxima
*/

function canGenerate() {
  return true
}

function generateProximaApplication(config) {
  generator.processSchema(config)
  generator.generateApplicationDatabase(config)

  generator.generateHandlers(config)
  generator.generateBlockchainClient(config)
  generator.generateProximaClient(config)
}

module.exports = {name: "gen", function: gen, description: "Generate the event-handlers from the config."};
