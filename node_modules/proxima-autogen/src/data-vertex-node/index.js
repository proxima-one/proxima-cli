'use strict'
const fs = require('fs-extra')
const gqlgenTemplate = require('./gqlgenTemplate.yml');
const dataVertexServerTemplate = "";
const resolverMainTemplate = "";
const dockerFileTemplate = "";
const generateDataVertexBash = "";

function buildDataVertex(config) {
  initDataVertex(config)
  generateDataVertex(config)
  buildResolvers(config)
  buildDataVertexServer(config)
}

function initDataVertex(config) {
  let location = ""
  fs.ensureDirSync(location + "/DataVertex")
  fs.copySync(location + '/schema/', location + '/DataVertex/schema/')
  fs.copySync(location + '/database/', location + '/DataVertex/database/')
  fs.outputFileSync(location + '/DataVertex/gqlgen.yml', gqlgenTemplate)
}

function generateDataVertex(config) {
  shell.exec("chmod +x " + generateDataVertexBash + "&& ./" + generateDataVertexBash)
}

function buildDataVertexServer(config) {
  let location = ""
  fs.outputFileSync(location + '/DataVertex/main.go', dataVertexServerTemplate)
  fs.outputFileSync(location + '/DataVertex/dockerfile', dockerFileTemplate)
}

function buildResolvers(schemaResolverFile, schemaResolverOutputFile) {
  fs.outputFileSync(location + '/DataVertex/resolvers/resolver.go', resolverMainTemplate)
  buildSchemaResolvers(schemaResolverFile, schemaResolverOutputFile)
}

function buildSchemaResolvers(schemaResolverFile, schemaResolverOutputFile) {

}

function buildDockerCompose(config) {
  
}

module.exports = buildDataVertex;
