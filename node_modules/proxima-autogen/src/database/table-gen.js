//generates the tables from the entities (so that they can be called)
//schema is taken, entities are taken from the schema and write a table
'use strict';

const fs = require('fs-extra');
const { parse, visit, print } = require("graphql/language");

function generateApplicationDatabase(appConfig, schemaFile, config_outputFile) {
  let schema = fs.readFileSync(schemaFile)
  let tables = parseSchema(schema.toString());

  let fileString = generate(appConfig, tables);

  fs.outputFileSync(config_outputFile, fileString);
}

function generate(appConfig, tables) {
  let config = defaultConfig(appConfig)
  let fileString = application(config.dbName, config)
  for (let i = 0; i < tables.length; i++)  {
      fileString += table(config.dbName, tables[i])
  }
  return fileString
}

function parseSchema(schema) {
  let tables = []
  parse(schema).definitions.forEach(ast => {
    if (ast.kind == 'ObjectTypeDefinition' && ast.name.value != "Query" && ast.name.value != "Mutation") {
    tables.push(ast.name.value + "s")
  }
  });
  return tables;
}

function application(dbName, config) {
  let appString =  "application:\n" +
    "\tname: " + dbName +"\n" +
    "\tid: " + config.id + "  \n" +
    "\towner: " + config.owner + "\n" +
    "\tversion: " + config.version + "\n" +
    "\tconfig:\n" +
      "\t\tcache: " + config.config.cache + "\n" +
      "\t\tcompression: " + config.config.compression + "\n" +
      "\t\tbatching: " + config.config.batching + "\n" +
    "\ttables:\n";
    return appString;
}

function defaultConfig(config) {
  let newConfig = {}
  newConfig.name = config.name || "Default"
  newConfig.dbName = config.dbName || "DefaultDB"
  newConfig.id = config.id || "DefaultID"
  newConfig.owner = config.owner || "None"
  newConfig.version = config.version || "0.0.0"
  //default values
  let cache = "5m"
  let sleep = "10m"
  let compression = "36h"
  let batching = "500ms"
  let header = ""
  let blockNum = "0"
  let version = "0.0.0"
  newConfig.config = config.config || {cache: cache, sleep: sleep, compression: compression, batching: batching}
  return newConfig
}

function table(dbName, tableName, cacheExpiration = "5m") {
  let cache = "5m"
  let sleep = "10m"
  let compression = "36h"
  let batching = "500ms"
  let header = "Root"
  let blockNum = "0"
  let version = "0.0.0"
  return "\t\t- name: " + tableName + "\n" +
  "\t\t  id: " + dbName +"-"+ tableName + " \n" +
  "\t\t  version: " +  version + " \n" +
  "\t\t  blockNum: " +  blockNum + " \n" +
  "\t\t  header: " +  header + " \n" +
  "\t\t  compression: " +  compression + " \n" +
  "\t\t  batching: " +  batching + " \n" +
  "\t\t  sleep: " +  sleep + " \n" +
  "\t\t  cacheExpiration: " +  cacheExpiration + " \n"
}

module.exports = {generateApplicationDatabase}
