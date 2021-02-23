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


function getSchemaDir(config) {
  //search the schema directory
  //replace the config
}

module.exports = {processSchema: processSchema, createTestStructs: processer.createTestStructs};
