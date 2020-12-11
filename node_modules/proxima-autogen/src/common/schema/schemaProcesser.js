'use strict';

const { parse, visit, print } = require("graphql/language");

var mutations = {}
var queries = {}
var entityStrings = {}
var entities = {}

function processSchema(schemaFile) {
  let schema = fs.readFileSync(schemaFile)
  let entities = parseSchema(schema)
  entities = checkEntities(entities)
  let entityText = generateEntitiesText(entities) //check entities
  let queryText = generateQueryText(entities)
  let schemaText = queryText + queryText + inputsText
  fs.writeFileSync(schemaFile, schemaText)
}

function readSchema(fileName) {
  let schema = fs.readFile(fileName)
  return schema
}

function parseSchema(schema) {
  return parse(schema)
}

module.exports = {}
