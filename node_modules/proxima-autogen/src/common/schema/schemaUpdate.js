'use strict';

const { parse, visit, print } = require("graphql/language");


function checkEntities(entities) {
  for (entity in entities) {
    checkEntity(entity)
  }
  return entities
}

function checkEntity(entity) {
  //if not input
  let newEntity = ensureEntityIsCorrect(entity)
  return ensureEntityIsOptimized(newEntity)
}

function ensureEntityIsCorrect(entity) {
  if (!entity) {
    entity = {}
  }
  if (!entity.id) {
    entity.id = "ID!"
  }
  if (entity.proof != "Proof") {
    entity.proof = "Proof"
  }
  return entity
}

function ensureEntityIsOptimized(entity) {
  return entity
}

function generateEntitiesText(entities) {
  let entityText = ""
  for (entity in entities) {
    entityText += generateEntityText(entity) + "\n"
    entityText += generateEntityInputText(entity) + "\n"
  }
  return entityText
}

function generateEntityText(entity) {
  let entityText = "type " + entity.name {\n"
  for (const [key, value] of Object.entries(entity.value)) {
    entityText += key + ": " + value + "\n"
  }
  return entityText + "}\n"
}

function generateEntityInputText(entity) {
  let input = "input " + entity.name + "Input {\n"
  for (const [key, value] of Object.entries(entity.value)) {
    input += key + ": " + value + "\n"
  }
  return input + "}\n"
}

function generateQueryText(entities) {
  let queryText = "type {\n"
  for (entity in entities) {
    queryText += generateGetQuery(entity)
    queryText += generateGetAllQuery(entity)
    queryText += generateSearchQuery(entity)
    queryText += generateMutation(entity)
  }
  queryText += "\n}\n\n"
  return queryText
}

function generateMutation(entity) {
  let entityMutation = "put" + entity.name + "(input: " entity.name + "Input!)\n"
  return entityMutation
}

function generateGetQuery(entity) {
  let entitiyGetQueryString = entity.name + "(id: ID!): "  + entity.name  + "!\n"
  return entitiyGetQueryString
}

function generateGetAllQuery(entity) {
  let entitiyGetAllQueryString = entity.name + "s(first: Int, last: Int, limit: Int): ["  + entity.name  + "!]!\n"
  return entitiyGetAllQueryString
}

function generateSearchQuery(entity) {
  let entitiyGetAllQueryString = entity.name + "s(queryText: Text!): ["  + entity.name  + "!]!\n"
  return entitiySearchQueryString
}

module.exports = {processSchema}
