`use strict`

const fs = require("fs-extra");

let commands = {};

//get the list of commandFile names from the command folder
let commandFiles = ["init.js", "gen.js", "build.js", "deploy.js", "run.js"];
//init -- creates the files
//gen -- generates the eventHandlers for the system given everything
//build -- builds the files for the database and the data vertex
//deploy -- deploys the files to the proxima node
//run -- runs the files locally


for (let fileIndex in  commandFiles) {
  let command = require("./commands/" + commandFiles[fileIndex]);
  commands[command.name] = {action: command.fn, description: command.description};
}

module.exports = commands;
