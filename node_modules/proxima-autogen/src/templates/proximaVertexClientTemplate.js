
'use strict'
const gql = require('graphql-tag');
//proximaVertexClient
//var fs = require('fs-extra');
//const yaml = require('js-yaml');
//defaultConfig = yaml.safeLoad(fs.readFileSync(configFile))
//let configFile = "./vertex-config.yml"

let defaultConfig = {}

//CONFIG CODE TO BE ADDED

const app_queries = {};

//QUERY CODE TO BE ADDED


function init(queries = app_queries, config = defaultConfig) {
  let name = config.name;
  let uri = config.uri;
  let args = config.args;

  let vertexClient = new proximaVertexClient(name, uri, queries, args)
  return vertexClient
}

module.exports = {init, app_queries, name, uri, config};
