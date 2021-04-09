//generates the tables from the entities (so that they can be called)
//schema is taken, entities are taken from the schema and write a table
'use strict';

var fs = require('fs');
const { parse, visit, print } = require("graphql/language");

function tablesFromSchema(appConfig, schemaFile) {
  let schema = await fs.readFile(schemaFile)
  let fileString = application();
  let fileLocation = "./db/config/"+appConfig.dbName+".yaml";
  await fs.writeFile(fileLocation, fileString);
}

function application(dbName, config) {
  let appString = "name: " + dbName +"\n" +
    "id: " + config.id + "  \n" +
    "owner: " + config.owner + "\n" +
    "version: " + config.version + "\n" +
    "config:\n" +
      "  cache: " + config.cache + "\n" +
      "  compression: " + config.compression + "\n" +
      "  batching: " + config.batching + "\n" +
      "  sleeping: " + config.sleeping + "\n" +
    "tables:\n";
    return appString;
}

//function


module.exports = tableFromSchema
