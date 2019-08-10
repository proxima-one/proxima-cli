"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Publish extends command_1.Command {
    async run() {
        console.log('Publishing');
    }
}
exports.Publish = Publish;
