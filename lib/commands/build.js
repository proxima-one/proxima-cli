"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Build extends command_1.Command {
    async run() {
        console.log('Building');
    }
}
exports.Build = Build;