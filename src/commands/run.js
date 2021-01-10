
`use strict`
const fse = require('fs-extra');
const path = require('path');
const { exec } = require("child_process");
//const shell = require('shell')


async function run() {
  return true
  //runDockerApplication()
}

function runDockerApplication(config) {
  exec("docker-compose build")
exec('docker-compose up', function(code, stdout, stderr) {
  console.log('Exit code:', code);
  console.log('Program output:', stdout);
  console.log('Program stderr:', stderr);
});

}

module.exports = {name: "run", fn: run, description: "Run the node, either locally or remotely."};
