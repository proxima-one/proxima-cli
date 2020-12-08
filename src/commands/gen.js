
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
    generateProximaApplication();
    GEN_ENDING_MESSAGE();
  }
}

function canGenerate() {
  return true
}

function generateProximaApplication() {
  //generate folders
  //config to generate function
  //write gen function
}

module.exports = {name: "gen", function: gen, description: "Generate the event-handlers from the config."};
