#! /usr/bin/env node
const { Command } = require('commander');
const commands = require('./commands.js');
const program = new Command();

program.version('0.0.2', '-v, --version')

for (var name in commands) {
  program
    .command(name)
    .description(commands[name].description)
    .action(commands[name].action);
}

program.parse(process.argv);
