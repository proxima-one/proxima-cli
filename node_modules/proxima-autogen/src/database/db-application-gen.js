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

//function 


module.exports = tableFromSchema(appConfig, schemaFile)
