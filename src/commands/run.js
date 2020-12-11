
`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');


async function run() {
  runDockerApplication()
}

function runDockerApplication(config) {
exec('docker-compose run', function(code, stdout, stderr) {
  console.log('Exit code:', code);
  console.log('Program output:', stdout);
  console.log('Program stderr:', stderr);
});

}


module.exports = = {name: "run", function: run, description: "Run the node, either locally or remotely."};
