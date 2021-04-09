
`use strict`
const fse = require('fs-extra');
const path = require('path');
const { exec } = require("child_process");
//const shell = require('shell')
const {updateState, getAppState} = require("../common/config/proximaConfig.js")

async function test() {
  msg.TEST_STARTING_MSG()
  if (canTest()) {
    let config = ""
    testDockerApplication(config)
  } else {
    msg.TEST_ERROR_MSG()
  }
}

function testDockerApplication(config) {
  exec("docker ") //run docker database
  //find test arg
  let vertexTestDir = "./DataVertex/pkg/vertex/"
  //process
  let vertexTestArg = "go test -v"
  exec(vertexTestArg, function(code, stdout, stderr) {
    console.log('Exit code:', code);
    console.log('Program output:', stdout);
    console.log('Program stderr:', stderr);
  });
}

function canTest() {
  return (getAppState() == "Built")
}

module.exports = {name: "test", fn: test, description: "Test the node locally."};
