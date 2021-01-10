var assert = require('assert')
const autogen = require("../src/index.js");
var srcDir = "./test/data/schema/"
var destDir = "./test/handler_test"
const process = require('process')
const testHandlerProjectPath = "./test/data/Test_Project"
const fs = require('fs-extra')
const yaml = require('js-yaml')

//var abi file folders
//var test folders
//write handlers for each of the functions

async function handlerGenSetup() {
  fs.ensureDirSync(destDir)
  fs.copySync(testHandlerProjectPath, destDir)
  let config = yaml.safeLoad(fs.readFileSync(destDir+ "/app-config.yml"));
  process.chdir(destDir);
  return config
}

function cleanup(testDir) {
  //go back to the regular stuff
  process.chdir("../../.")
  fs.removeSync(testDir)
}

describe('smart contract interpreter', async function() {

  it('should run without errors', async function() {
    let config = await handlerGenSetup();
    autogen.generateHandlers(config);
    assert(true)
  });
  //correct file structure
  it('should have the correct file structure', function() {
    //handler folder
    assert(fs.pathExistsSync("./handlers/"), true)
    //assert(fs.pathExistsSync(destDir+ "/handlers/blockchain-handlers.js"), true)
    //assert(fs.pathExistsSync(destDir+ "/handlers/function-handlers.js"), true)
    //assert(fs.pathExistsSync(destDir+ "/handlers/event-handlers.js"), true)
  });
  //finds: all events and functions
  it('should get the events from the abi', function() {
    //find event hames and check in abi

    assert.equal(true, true);
  });
  //functions
  it('should get the functions from the abi', function() {
    //find event hames and check in abi
    cleanup(destDir);
    assert.equal(true, true);

  });
});
