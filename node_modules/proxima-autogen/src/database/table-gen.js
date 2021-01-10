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
  newConfig.config = config.config || {cache: "0", compression: "0", batching: "0"}
  return newConfig
}

function table(dbName, tableName) {
  return "\t\t- table:\n" +
  "\t\t\tname: " + tableName + "\n" +
  "\t\t\tid: " + dbName +"-"+ tableName + " \n";
}


module.exports = {generateApplicationDatabase}
