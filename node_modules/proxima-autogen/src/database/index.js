'use strict'

function generateApplicationDatabase(config) {
  let outputSchema = "./database/db-config-"+config.name+".yaml";
  let schemaFile = config.schema.file
  let appConfig = config
  generateApplicationDatabase(appConfig, schemaFile, outputSchema)
}

module.exports = generateApplicationDatabases;
