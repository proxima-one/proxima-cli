`use strict`;
const fs = require("fs-extra");
const chalk = require("chalk");
const path = require("path");
const generator = require("proxima-autogen");
const msg = require("../common/organization/gen_messages.js");
const yaml = require("js-yaml");
const {
  updateState,
  getAppState,
} = require("../common/config/proximaConfig.js");
/*
Generate
- Generate Dapp aggregator/eventHandlers from the abi code
*/
async function gen() {
  msg.GEN_STARTING_MESSAGE();
  if (canGenerate()) {
    let config = yaml.safeLoad(fs.readFileSync("./app-config.yml", "utf8"));
    let resp = await generateProximaApplication(config);
    msg.GEN_ENDING_MESSAGE();
    updateState("Generated"); //
  } else {
    msg.GEN_ERROR_MSG();
  }
}

/*
App Config from proxima
*/
function canGenerate() {
  //pregeneration
  //schema
  //abi + datasources
  //
  return getAppState() == "Initialized";
}

async function generateProximaApplication(config, test = true) {
  let proximaConfig = yaml.safeLoad(fs.readFileSync("./.proxima.yml", "utf8"));
  generator.processSchema(config);
  generator.generateApplicationDatabase(config);
  //generator.//generateProximaSDKVertexClient(config);
  //other stuff, autogen
  generator.generateHandlers(config);
  //let resp = await generator.generateEthereumTypescriptTemplates(config); //
  //let resp = await generator.generateEthereumTypescriptTemplates(config); //
  //generator.generateBlockchainClient(config) //update
  //update the app_config
  if (test) {
    generator.createTestEntities(config, "", "");
    generator.createTestQueries(config, "", "");
  }
  let proximaConfigText = yaml.safeDump(proximaConfig);
  fs.outputFileSync("./.proxima.yml", proximaConfigText);
}

module.exports = {
  name: "gen",
  fn: gen,
  description: "Generate the event-handlers from the config.",
};
