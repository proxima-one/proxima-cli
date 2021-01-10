'use strict'
const appGen = require("./table-gen.js");

function generateApplicationDatabase(config, output = "") {
  let outputSchema = output || "./database/db-config.yaml";
  let schemaFile = config.schema.file
  let appConfig = config
  appGen.generateApplicationDatabase(appConfig, schemaFile, outputSchema)
}

module.exports = {generateApplicationDatabase};
