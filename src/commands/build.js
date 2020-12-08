
`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');


async function build() {
  BUILD_STARTING_MESSAGE()
  if (folder) {
    build_project()
  }
  build_docker_project()
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
async function build_project_folders() {
  console.log("Not implemented.")
}

/*
Build the docker containers
- build docker compose from the proxima.yml
- then make the correct dockerfiles (if blank, then)
*/
async function build_docker_compose() {
  console.log("Not implemented.")
}

async function build_docker_files() {
  console.log("Not implemented.")
}

module.exports = = {name: "build", function: build, description: "Build the data vertex app"};
