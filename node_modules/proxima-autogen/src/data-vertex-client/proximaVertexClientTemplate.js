
'use strict'
const gql = require('graphql-tag');
//proximaVertexClient
//var fs = require('fs-extra');
//const yaml = require('js-yaml');
//defaultConfig = yaml.safeLoad(fs.readFileSync(configFile))
//let configFile = "./vertex-config.yml"
const VertexClient = require('proxima-vertex-client')

let defaultConfig = {}

//CONFIG CODE TO BE ADDED

const app_queries = require('./app_queries.json');

//QUERY CODE TO BE ADDED


function init(queries = app_queries, config = defaultConfig) {
  let name = config.name || "Default";
  let id = config.id || "";
  let args = config.args;

  let vertexClient = new VertexClient(name, id, queries, args)
  return vertexClient
}

module.exports = {init, app_queries, name, uri, config};
