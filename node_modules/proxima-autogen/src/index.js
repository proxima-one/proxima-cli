"use strict";
const { generateApplicationDatabase } = require("./database/index.js");
const {
  processSchema,
  createTestEntities,
  createTestQueries,
} = require("./schema/index.js");
const {
  buildDataAggregator,
  generateHandlers,
} = require("./dapp-aggregator/index.js");
const { generateBlockchainClient } = require("./blockchain-client/index.js");
const {
  generateProximaSDKVertexClient,
  generateEthereumTypescriptTemplates,
  generateSchemaTypescriptTemplates,
} = require("./proxima-sdk-vertex-client/index.js");
const { buildDataVertex } = require("./data-vertex-node/index.js");

module.exports = {
  generateEthereumTypescriptTemplates,
  generateSchemaTypescriptTemplates,
  generateApplicationDatabase,
  buildDataVertex,
  generateBlockchainClient,
  generateProximaSDKVertexClient,
  processSchema,
  createTestEntities,
  createTestQueries,
  buildDataAggregator,
  generateHandlers,
};
