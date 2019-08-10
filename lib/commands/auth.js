"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Auth extends command_1.Command {
    async run() {
        console.log('Authenticating');
    }
}
exports.Auth = Auth;
