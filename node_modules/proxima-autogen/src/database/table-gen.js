//generates the tables from the entities (so that they can be called)
//schema is taken, entities are taken from the schema and write a table
'use strict';

var fs = require('fs');
const { parse, visit, print } = require("graphql/language");

function generateApplicationDatabase(appConfig, schemaFile, db-config-ouputFile) {
  let schema = fs.readFileSync(schemaFile)
  let tables = parseSchema(schema);
  let fileString = generate(appConfig, tables);

  fs.writeFileSync(db-config-outputFile, fileString);
}

function generate(appConfig, tables) {
  let fileString = application(appConfig.dbName, appConfig)
  for (let i = 0; i < tables.length; i++)  {
      appString += table(appConfig.dbName, tables[i])
  }
  return fileString
}

function parseSchema(schema) {
  tables = []
  parse(schema).definitions.forEach(ast => {
    if (ast.name.value != "Query" && ast.name.value != "Mutation")) {
    tables.append(ast.name.value) + "s"
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
      "\t\tcache: " + config.cache + "\n" +
      "\t\tcompression: " + config.compression + "\n" +
      "\t\tbatching: " + config.batching + "\n" +
    "\ttables:\n";
    return appString;
}

function table(dbName, tableName) {
  return "\t\t- table:\n" +
  "\t\t\tname: " + tableName + "\n" +
  "\t\t\tid: " + dbName +"-"+ tableName + " \n";
}


module.exports = generateApplicationDatabase(appConfig, schemaFile)
