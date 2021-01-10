'use strict';

const { parse, visit, print } = require("graphql/language");
const fs = require("fs-extra");
const clientFileTemplate = (fs.readFileSync(require.resolve("./proximaVertexClientTemplate.js"))).toString()

function generateVertexClient(config) {
  let clientFileName = "./vertex-client/index.js"
  let configText = generateConfigText(config)
  let clientFileText = clientFileTemplate.replace("//CONFIG CODE TO BE ADDED", configText);
  fs.outputFileSync(clientFileName, clientFileText)

  let queryFileName = "./vertex-client/app_queries.json"
  let schema = (fs.readFileSync(config.schemaFile)).toString()
  let entities = generateEntities(schema)
  let queryText = generateVertexClientQueryText(entities)
  fs.outputFileSync(queryFileName, queryText)
}

function generateConfigText(config) {
  let configText = "defaultConfig.name = " + config.name + "\n"
  configText += "defaultConfig.id = " + config.id + "\n"
  configText += "defaultConfig.args = {} \n"
  return configText
}

function generateEntities(schema) {
  let entities = parse(schema).definitions
  let entitiesDict = {}
  for (const entity of entities) {
    if (entity.kind == 'ObjectTypeDefinition' && entity.name.value != "Query" && entity.name.value != "Mutation") {
      entitiesDict[entity.name.value] = generateEntityText(entity, {})
    }
  }
  return entitiesDict
}

function generateEntityText(entity, entitiesDict) {
  let entityText = entity.name.value  + " {\n"
  for (const field of entity.fields) {
    entityText += processFieldDefinition(field) + "\n"
  }
  return entityText + "}\n"
}

function processFieldDefinition(field) {
  let fieldText = field.name.value + "\n "
  let endText = ""
  field = field.type
  while (field.kind && field.kind != "NamedType") {
    if (field.kind == "ListType") {
      fieldText += "{"
      endText = "}" + endText
    }
    field = field.type
  }
  return fieldText + endText
}

function generateVertexClientQueryText(entities) {
  let app = {}
  for (var entityName in entities) {
    //console.log(entityName)
    let entity = entityName
    let entityText = entities[entityName]
    app[entityName + "s"] = {
        get: generateGetQuery(entity, entityText),
        getAll: generateGetAllQuery(entity, entityText),
        search: generateSearchQuery(entity, entityText),
        put: generateMutation(entity, entityText)
    }
  }
  return JSON.stringify(app)
}

function generateMutation(entityName, entityText) {
  let entityMutation = " gql'put" + entityName + "($input: " + entityName + "Input!) {\n" +
  "put" + entityName + "(input: $input) {\nresponse\n}\n}\n}'\n\n";
  return entityMutation
}

function generateGetQuery(entityName, entityText) {
  let entityGetQueryString = "" + " gql'" + entityName + "($id: ID!, $prove: Boolean) {\n"  + entityName  + "(id: $id, prove: $prove) {\n" + entityText + "\n}\n}'\n\n";
  return entityGetQueryString
}

function generateGetAllQuery(entityName, entityText) {
  let entityGetAllQueryString = "" + " gql'" + entityName + "s($first: Int, $last: Int, $limit: Int, $prove: Boolean) { \n"  + entityName + "s(first: $first , last: $last, limit: $limit, prove: $prove) { \n" + entityText + "\n}\n}'\n\n";
  return entityGetAllQueryString
}

function generateSearchQuery(entityName, entityText) {
  let entitySearchQueryString = " gql'" + entityName + "s($queryText: Text!, $prove: Boolean) {\n"  + entityName + "s(queryText: $queryText, prove: $prove) {\n"  +
  entityText + "\n}\n}'\n\n";
  return entitySearchQueryString
}

module.exports = {generateVertexClient}
