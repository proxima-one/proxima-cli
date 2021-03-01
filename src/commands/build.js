
`use strict`
const fs = require('fs-extra');
//const shell = require('shell')
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');
const { exec } = require("child_process");

const generator = require('proxima-autogen')
const msg = require('../common/organization/build_messages.js');
const dockerComposeFileTemplatePath = require.resolve("../common/templates/docker-compose-data-vertex-template.yml")


async function build() {
  msg.BUILD_STARTING_MESSAGE()
  let config = yaml.safeLoad(fs.readFileSync('./app-config.yml', 'utf8'))
  let resp = await buildProximaApplication(config)
  resp = await buildDockerCompose()
  msg.BUILD_ENDING_MESSAGE()
}

async function buildProximaApplication(config, test = true, local = true) {
  let proximaConfig = yaml.safeLoad(fs.readFileSync('./app-config.yml', 'utf8'))
  generator.buildDataAggregator(config)
  let resp = await generator.buildDataVertex(config)
  buildDockerCompose(config)
  if (test) {
    generator.createTestStructs(config, "", "")
  }
  let proximaConfigText = yaml.safeDump(proximaConfig)
  fs.writeFileSync('./app-config.yml', proximaConfigText);
}

// async function buildTestStructs(config) {
//   let inputSchemaFileName = config.schema
//   let outputJSONFileName = ""
//   //directory
//   //ensure directory
//   generator.createTestStructs(inputSchemaFileName, outputJSONFileName)
// }

async function buildDockerCompose() {
  let proximaConfig = yaml.safeLoad(fs.readFileSync('./.proxima.yml', 'utf8'))
  let dockerCompose = yaml.safeLoad(fs.readFileSync(dockerComposeFileTemplatePath))
  dockerCompose.services.data_vertex_node.build = proximaConfig.data_vertex_node
  dockerCompose.services.data_aggregator.build = proximaConfig.data_aggregator
  let dockerComposeText = yaml.safeDump(dockerCompose);
  fs.outputFileSync("./docker-compose.yml", dockerComposeText)
}

module.exports = {name: "build", fn: build, description: "Build the data vertex app"};
