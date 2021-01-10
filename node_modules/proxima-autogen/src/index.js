'use strict'
const {generateApplicationDatabase} = require("./database/index.js");
const {processSchema} = require("./schema/index.js");
const {buildDataAggregator, generateHandlers} = require("./dapp-aggregator/index.js");
const {generateBlockchainClient} = require("./blockchain-client/index.js");
const {generateProximaVertexClient} = require("./data-vertex-client/index.js")
const {buildDataVertex} = require("./data-vertex-node/index.js");

module.exports = {
  generateApplicationDatabase,
  buildDataVertex,
  generateBlockchainClient,
  generateProximaVertexClient,
  processSchema,
  buildDataAggregator,
  generateHandlers
}
