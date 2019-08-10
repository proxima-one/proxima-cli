"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Init extends command_1.Command {
    async run() {
        console.log('Initializing');
    }
}
exports.Init = Init;
