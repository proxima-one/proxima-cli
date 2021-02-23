'use strict';

const { parse, visit, print } = require("graphql/language");
const fs = require("fs-extra")

function processSchema(schemaFile) {
  let schema = (fs.readFileSync(schemaFile)).toString()
  let entities = parseSchema(schema)
  entities = checkEntities(entities)   //
  let entityDict = makeDict(entities)
  let entityText = generateEntitiesText(entities, entityDict) //check entities
  let queryText = generateQueryText(entities, entityDict)
  let schemaText = queryText + entityText
  fs.writeFileSync(schemaFile, schemaText)
}

function createTestStructs(inputSchemaFile, outputJSONFile) {
  let schema = (fs.readFileSync(inputSchemaFile)).toString()
  let entities = parseSchema(schema)
  entities = checkEntities(entities)
  let entityTestStructs = generateEntityTestStructs(entities)
  let outputText = JSON.stringify(entityTestStructs)
  fs.outputFileSync(outputJSONFile, outputText)
}

function getEntityName(entity) {
  // let entityType = getEntityType(entity)
  // switch (entityType) {
  //   case "entity":
  //     return entity.name.value
  //   case "entityInput":
  //     return (entity.name.value).replace("Input", "")
  //   default:
  //     return entity.name.value
  // }
  return (entity.name.value).replace("Input", "")
}

function getEntityType(entity) {
  let objectType = entity.kind
  let objectName = entity.name.value
  if (objectName == "Query" || objectName == "Mutation") {
    return objectName.toLowerCase()
  }
  if (objectType == "InputObjectTypeDefinition") {
    return "entityInput"
  }
  return "entity"
}

function generateEntityTestStructs(entities) {
  var name;
  var entityTestFunctions;
  var completeTestStructs ={};
  //console.log(entities)
  for (const entity of entities) {
    let entityType = getEntityType(entity)
    //console.log(entityType)
    if (entityType == "mutation" || entityType == "query") {
      continue
    }
    let name = getEntityName(entity)
    let completeTestStruct = {name: name}
    if (completeTestStructs[name]) {
      completeTestStruct = completeTestStructs[name]
    }
    completeTestStruct[entityType] = generateEntityTestStruct(entity)
    completeTestStructs[name] = completeTestStruct
    if (entityType == "entity") {
      let entityTestFns = generateEntityTestFunctions(entity)
      completeTestStructs[name].operations = entityTestFns
    }
  }
  return completeTestStructs
}

function generateEntityTestFunctions(entity) {
  let name = getEntityName(entity)
  let entityTestFunctions = {}
  let operations = ["get", "getAll", "search", "put"]

  for (const operation of operations) {
    entityTestFunctions[operation] = generateEntityTestFunction(name, entity, operation)
  }
  return entityTestFunctions
}

function generateEntityTestFunction(name, entity, operation) {
  let variables = {}
  let outputs = {}

  let queryName = operation + name
  let entityType = "query"
    switch (operation) {
      case "get":
        variables = {id: "string", prove: "bool"}
        //single, error
        outputs = {}
      case "getAll":
        variables = {first: "int", last: "int", limit: "int", prove: "bool"}
        //list, error
        outputs = {}
      case "search":
        variables = {queryString: "string", prove: "bool"}
        //list, error
        outputs = {}
      case "put":
        entityType = "mutation"
        variables = {input: name + "Input" }
        //bool, error
        outputs = {}
    }

  return {name: queryName, type: entityType, variables: variables, outputs: outputs}
}

function generateEntityTestStruct(entity) {
  var variableName;
  let vars = {}

for (const field of entity.fields) {
    variableName = field.name.value;
    let isList, isRequired, variableType = processJSONFieldDefinition(field)
    vars[variableName] = {name: variableName, type: variableType, isList: isList, required: isRequired}
  }
  return vars
}

function generateEntitiesText(entities, entityDict = {}) {
  let entityText = ""
  for (const entity of entities) {
      if (entity.kind == 'ObjectTypeDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
      entityText += generateEntityText(entity, entityDict) + "\n"
      entityText += generateEntityInputText(entity, entityDict) + "\n"
      }
      if (entity.kind == 'InputObjectTypeDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
        entityText += generateEntityInputText(entity, entities) + "\n"
      }
  }
  return entityText
}

function makeDict(entities) {
  let entityDict = {}
  for (const entity of entities) {
    entityDict[entity.name.value] = entity
  }
  return entityDict
}

function readSchema(fileName) {
  let schema = fs.readFile(fileName)
  return schema
}

function parseSchema(schema) {
  return parse(schema).definitions
}

function checkEntities(entities) {
  for (const entity of entities) {
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
  if (entity.proof != "String") {
    entity.proof = "String"
  }
  return entity
}

function ensureEntityIsOptimized(entity) {
  return entity
}

function generateEntitiesText(entities, entityDict = {}) {
  let entityText = ""
  for (const entity of entities) {
      if (entity.kind == 'ObjectTypeDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
      entityText += generateEntityText(entity, entityDict) + "\n"
      entityText += generateEntityInputText(entity, entityDict) + "\n"
      }
      if (entity.kind == 'ObjectInputDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
        entityText += generateEntityInputText(entity, entities) + "\n"
      }
  }
  return entityText
}

function generateEntityText(entity, entityDict = {}) {
  let entityText = "type " + entity.name.value  + " {\n"
  //field.kind == 'NonNullableType'
  //List Type  [], then get the name of the
  for (const field of entity.fields) {
    entityText += processFieldDefinition(field, entityDict) + "\n"
  }
  return entityText + "} \n"
}

function processFieldDefinition(field, entityDict = {}, inputText = "") {
  let fieldText = field.name.value +  ": "
  let endText = ""
  field = field.type
  while (field.kind && field.kind != "NamedType") {
    if (field.kind == "NonNullableType") {
      endText = "!" + endText
    }
    if (field.kind == "ListType") {
      fieldText += "["
      endText = "]" + endText
    }
    field = field.type
  }
  let name = field.name.value
  if (entityDict[name]) {
    name = name + inputText
  }
  return fieldText +  name + endText
}

function processJSONFieldDefinition(field) {
  var variableType;
  let isRequired = false;
  let isList = false;

  field = field.type
  while (field.kind && field.kind != "NamedType") {
    if (field.kind == "NonNullableType") {
      isRequired = true
    }
    if (field.kind == "ListType") {
      isList = true
    }
    field = field.type
  }
  variableType = field.name.value
  return isList, isRequired, variableType
}

function generateEntityInputText(entity, entityDict = {}) {
  let inputText = "input " + entity.name.value + "Input {\n"
  for (const field of entity.fields) {
    inputText += processFieldDefinition(field, entityDict, "Input") + "\n"
  }
  return inputText + "}\n"
}

function generateQueryText(entities) {
  let queryText = "type Query {\n"
  let mutationText = "type Mutation {\n"
  for (const entity of entities) {
    if (entity.kind == 'ObjectTypeDefinition' && entity.kind != "Query" && entity.kind != "Mutation" && entity.name.value != "Query" && entity.name.value != "Mutation") {
      queryText += generateGetQuery(entity)
      queryText += generateGetAllQuery(entity)
      queryText += generateSearchQuery(entity)
      mutationText += generateMutation(entity)
    }
  }
  return queryText + "\n}\n\n" + mutationText + "\n}\n\n"
}

function generateMutation(entity) {
  let entityMutation = "put" + entity.name.value + "(input: " + entity.name.value + "Input!): Boolean \n"
  return entityMutation
}

function generateGetQuery(entity) {
  let entitiyGetQueryString = entity.name.value + "(id: ID!, prove: Boolean): "  + entity.name.value  + "!\n"
  return entitiyGetQueryString
}

function generateGetAllQuery(entity) {
  let entitiyGetAllQueryString = entity.name.value + "s(first: Int, last: Int, limit: Int, prove: Boolean): ["  + entity.name.value  + "!]!\n"
  return entitiyGetAllQueryString
}

function generateSearchQuery(entity) {
  let entitySearchQueryString = entity.name.value + "Search(queryText: String!, prove: Boolean): ["  + entity.name.value  + "!]!\n"
  return entitySearchQueryString
}

module.exports = {processSchema, createTestStructs}
