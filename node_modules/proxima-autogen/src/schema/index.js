'use strict';

const fs = require('fs-extra');
const processer = require('./schemaProcesser.js')


function processSchema(config, file = "") {
  let schemaFile = file
  if (schemaFile == "") {
    schemaFile = config.schema.file
  }
  processer.processSchema(schemaFile)
  //return the config file
}

function createTestStructs(config, sFile = "", outFile = "") {
  let outputFile = outFile
  let schemaFile = sFile
  if (schemaFile == "") {
    schemaFile = config.schema.file
  }
  if (outputFile == "") {
    outputFile = "./test-structs/" + config.name + "_test.json"
  }
  processer.createTestStructs(schemaFile, outputFile)
}


function getSchemaDir(config) {
  //search the schema directory
  //replace the config
}

module.exports = {processSchema: processSchema, createTestStructs: createTestStructs};
