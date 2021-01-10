'use strict'


const vertex = require('./proximaClientGenerator.js');


function generateProximaVertexClient(config) {
  let vertexConfig = {}
  vertexConfig.name = config.name
  vertexConfig.schemaFile = config.schema.file
  vertex.generateVertexClient(vertexConfig)
}

module.exports = {generateProximaVertexClient}
