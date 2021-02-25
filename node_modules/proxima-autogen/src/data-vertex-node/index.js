'use strict'
const fs = require('fs-extra')
const yaml = require('js-yaml')
const gqlgenTemplatePath = require.resolve('./gqlgenTemplate.yml');
//fix this
const { exec } = require("child_process");
const resolverGen = require('./resolvers/resolverGenerator.js');
const dataVertexServerTemplatePath = require.resolve('./dataVertexTemplate.go');
const resolverMainTemplatePath = require.resolve('./resolvers/resolverTemplate.go');
const dockerFileTemplatePath = require.resolve('./dockerfile');
const generateDataVertexBash = require.resolve('./data-vertex-builder.sh');

var git_url = "https://github.com/proxima-one/data-vertex.git"

const buildResolvers = resolverGen.buildResolvers

async function buildDataVertex(config) {
  let resp = await initDataVertex(config)
  populateDataVertex(config)
  let esp = await generateDataVertexGQL(config)
  buildResolvers("./DataVertex/pkg/resolvers/schema.resolvers.go", "./DataVertex/pkg/resolvers/resolver_fns.go")
  let sp = await buildDataVertexServer(config)
}



function populateDataVertex(config) {
  let location = "."
  fs.ensureDirSync(location + "/DataVertex")
  let proximaConfig = yaml.safeLoad(fs.readFileSync('./.proxima.yml'))
  proximaConfig.data_vertex_node = location + "/DataVertex"
  fs.copySync(location + '/schema/', location + '/DataVertex/schema/')
  fs.copySync(location + '/database/', location + '/DataVertex/database/')
  fs.copySync(gqlgenTemplatePath, location + '/DataVertex/.gqlgen.yml')
  fs.copySync(location + "/app-config.yml", location + "/DataVertex/app-config.yml")
  fs.outputFileSync(location + "/DataVertex/.proxima.yml", yaml.safeDump(proximaConfig))
}

async function initDataVertex(config) {
  fs.removeSync("./DataVertex")
  let resp = await new Promise((resolve, reject) => {
  exec("chmod 744 " + generateDataVertexBash + " && " + generateDataVertexBash + " " + git_url + " " + config.name, function(error, stdout, stderr) {
        console.log('Running node...');
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
            // Reject if there is an error:
            return reject(error);
        }

        // Otherwise resolve the promise:
        resolve();
    });
  }, 10000);
    return resp
}

async function generateDataVertexGQL(config) {
  let resp = await new Promise((resolve, reject) => {
  exec("cd 'DataVertex' && go get github.com/99designs/gqlgen@v0.12.2 && go run github.com/99designs/gqlgen", function(error, stdout, stderr) {
        console.log('Running node...');
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
            // Reject if there is an error:
            return reject(error);
        }

        // Otherwise resolve the promise:
        resolve();
    });
  }, 10000);
    return resp
}

async function buildDataVertexServer(config) {
  let location = "."
  fs.copySync(dockerFileTemplatePath, location + '/DataVertex/dockerfile')
  let resp = await new Promise((resolve, reject) => {
  exec("cd 'DataVertex' && go get && go build", async function(error, stdout, stderr) {
        console.log('Running node...');
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
            // Reject if there is an error:
            return reject(error);
        }

        // Otherwise resolve the promise:
        resolve();
    });
    }, 10000);
}

module.exports = {buildDataVertex, buildResolvers};
