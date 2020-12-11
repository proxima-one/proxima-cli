
`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');


async function build() {
  BUILD_STARTING_MESSAGE()
  let config = getApplicationConfig()
  buildProximaApplication(config, local)
  BUILD_ENDING_MESSAGE()
}

/*
Using the config from proxima.yml and the application config...
Build or update full application folders
- build schema updates
- build the data vertex
- build the dapp aggregator
- build the database config
- build the blockchain client
*/
async function buildProximaApplication(config, local = true) {
  generator.buildDataVertex(config)
  generator.buildDAppAggregator(config)
  generator.buildDockerCompose(config)
}




module.exports = = {name: "build", function: build, description: "Build the data vertex app"};
