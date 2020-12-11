'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');


function processSchema(config) {
  let schemaFile = config.schema.file
  processSchema(schemaFile)
}

module.exports = processSchema;
