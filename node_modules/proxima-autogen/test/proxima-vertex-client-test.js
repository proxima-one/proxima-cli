"use strict";
var assert = require("assert");
// const autogen = require("../src/index.js");
// var srcDir = "./test/data/schema/"
// var destDir = "./test/vertex_client_test"
// const testHandlerProjectPath = "./test/data/Test_Project"
// const fs = require('fs-extra')
// const yaml = require('js-yaml')
//
// async function vertexClientGenSetup() {
//   fs.ensureDirSync(destDir)
//   fs.copySync(testHandlerProjectPath, destDir)
//   let config = yaml.safeLoad(fs.readFileSync(destDir+ "/app-config.yml"));
//   process.chdir(destDir);
//   return config
// }
//
// function cleanup() {
//   process.chdir("../../.")
//   //fs.removeSync(destDir)
// }
//
//
// describe('proxima vertex client gen', async function() {
//
//   //correct file structure
//   it('should run correctly', async function() {
//     let config = await vertexClientGenSetup()
//     autogen.generateProximaSDKVertexClient(config)
//     assert(true);
//   });
//   //correct file structure
//   it('should have the correct file structure', function() {
//     assert(fs.pathExistsSync("./proxima-sdk-vertex-client/"), true)
//     assert(fs.pathExistsSync("./proxima-sdk-vertex-client/index.js"), true)
//   });
//   //exports done correctly
//   it('should export the vertex correctly with queries', function() {
//     assert(fs.pathExistsSync("./proxima-sdk-vertex-client/app_queries.json"), true)
//     cleanup();
//     assert(true);
//   });
// });
