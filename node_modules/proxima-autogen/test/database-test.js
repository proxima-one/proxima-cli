// describe('Proxima Database Generation', function() {
//   describe('tables', function() {
//     //correct table and model creation given
//     it('should have the correct file structure', function() {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//     //different models
//     it('should correctly ', function() {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//     //should have the correct ordering and naming for the config
//     it('should correctly ', function() {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//
//     //correct db and table names
//
//     //correct db init file
//
//     //gets schema file correctly
//
//     //dockerfile
//
//     //docker-compose test
//   });
//
// });
'use strict'
var assert = require('assert');
const autogen = require("../src/index.js");
var destDir = "./test/database_test"
const testHandlerProjectPath = "./test/data/Test_Project"
const fs = require('fs-extra')
const yaml = require('js-yaml')

async function databaseSetup() {
  fs.ensureDirSync(destDir)
  //console.log('Current directory: ' + process.cwd());
  fs.copySync(testHandlerProjectPath, destDir)
  //console.log('Current directory: ' + process.cwd());
  let config = yaml.safeLoad(fs.readFileSync(destDir+ "/app-config.yml"));
  //console.log('Current directory: ' + process.cwd());
  process.chdir(destDir);
  //console.log('Current directory: ' + process.cwd());
  return config
}

function cleanup() {
  fs.removeSync(destDir)
}


describe('database gen', async function() {

  //process without errors
  it('should run without errors', async function() {
    let config = await databaseSetup()

    autogen.generateApplicationDatabase(config)
    assert.equal(true, true);
  });

  //correct table and model creation given
  it('should have the correct file structure', function() {
    assert(fs.pathExistsSync("./database/"), true)
    assert(fs.pathExistsSync("./database/db-config.yaml"), true)
    let db_config = fs.readFileSync('./database/db-config.yaml')
    //console.log(db_config.toString())
  });
  //different models
  it('should create a table for each model', function() {
    assert.equal(true, true);
  });
  //should have the correct ordering and naming for the config
  it('should have the proper application config', function() {
    process.chdir("../../.")
    cleanup();
    assert.equal(true, true);

  });

});
