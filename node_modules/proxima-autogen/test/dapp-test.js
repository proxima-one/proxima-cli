'use strict'
var assert = require('assert');
const autogen = require("../src/index.js");
var srcDir = "./test/data/schema/"
var destDir = "./test/dapp_client_test"
const testHandlerProjectPath = "./test/data/Test_Project"
const fs = require('fs-extra')
const yaml = require('js-yaml')

async function dataAggregatorSetup() {
  fs.ensureDirSync(destDir)
  fs.copySync(testHandlerProjectPath, destDir)
  fs.outputFileSync(destDir + "/vertex-client/index.js", "vertex client")
  fs.outputFileSync(destDir + "/blockchain-clients/index.js", "blockchain client")
  let config = yaml.safeLoad(fs.readFileSync(destDir+ "/app-config.yml"));
  process.chdir(destDir);
  return config
}

function cleanup() {
  fs.removeSync(destDir)
}

describe('dapp aggregator gen', async function() {

  //correct file structure
  it('should run correctly', async function() {
    let config = await dataAggregatorSetup();
    autogen.buildDataAggregator()
    assert.equal(true, true);
  });
  //finds the blockchain client (autogen) ? if not already there
  it('should have the abi and schema', function() {
    //assert(fs.pathExistsSync("./DataAggregator/schema"), true)
    assert(fs.pathExistsSync("./DataAggregator/abi"), true)
  });
  //abi code import
  it('should have function handlers', function() {
    assert(fs.pathExistsSync("./DataAggregator/handlers"), true)
  });
  //uses the interpreters for the smart contracts (autogen)
  it('should have blockchain client and vertex client', function() {
    assert(fs.pathExistsSync("./DataAggregator/vertex-client"), true)
    assert(fs.pathExistsSync("./DataAggregator/blockchain-clients"), true)
  });
  //correctly adds
  it('should have the dockerfile', function() {
    assert(fs.pathExistsSync("./DataAggregator/dockerfile"), true)
    assert(fs.pathExistsSync("./DataAggregator/package.json"), true)
    process.chdir("../../.");
    cleanup();
    assert(true)
  });
});
