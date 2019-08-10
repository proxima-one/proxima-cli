

//#!/usr/bin/env node
const program = require('commander')
//const Ora = require('ora-core')
const Datasource = require('./datasource.js')
const chalk = require('chalk');
const fs = require('fs-extra')

//Set version
program.version('0.0.1', '-v, --version')


/*
  init
  Create a new Ora node
    -- Flag f: New init file
    Default is config.json
*/
program
  .command('init')
  .action(function (cmd) {
    console.log(chalk.green('Initializing a new project.... '))
    console.log(chalk.green('.... '))
    console.log(chalk.green('.... '))
    console.log(chalk.green('.... '))
    console.log(chalk.green('Completed'))
    init()
})



/*
  start
  Start an Ora node
    -- Flag d: detached
*/
program
  .command('start')
  .action(function (cmd) {
    console.log(chalk.green('Starting the node.... '))
    start()
})


program
  .command('build')
  .action(function (cmd) {
    console.log(chalk.green('Building.... '))
    build()
})


/*
  stop
  Stop an Ora node
*/
program
  .command('stop')
  .action(function (cmd) {
    console.log(chalk.red('Stopping the node.... '))
    stop()
})




async function init() {
  //init
  //if (fs.readFileSync())
  //create folder for schema
  const fse = require('fs-extra');

  fse.outputFile('schema/schema.md', 'Schema Document', err => {});
  //create folder for abi
  fse.outputFile('abi/abi.md', 'This is the folder for ABI code', err => {});
  //create config.yml
  let yml =  "name: Name of Project \n"
  yml +=  "owner: Your id\n"
  yml +=  "id: Project id\n"

  yml += "name: Name of Project \n"
  yml += "contract: 'Contract Address' \n"
    yml +=  "abi: Your ABI Path \n"
      yml +=  "datasource: Your Datasource \n"
  fse.outputFile('configs.yml', yml, err => {});
}

async function build() {
  //build
  Datasource.main()
}

async function start() {
  //await init()
  //run the server
  const server = require('./server.js')
}


async function stop() {
  console.log("Stopping")
 //kill the server
}




//ending
program.parse(process.argv)
