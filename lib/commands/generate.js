"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
class Generate extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(Generate);
        const name = flags.name || 'world';
        this.log(`hello ${name} from ./src/commands/hello.ts`);
        if (args.file && flags.force) {
            this.log(`you input --force and --file: ${args.file}`);
        }
    }
}
Generate.description = 'says hello';
Generate.examples = [
    `$ proxima hello
hello world from ./src/hello.ts!
`,
];
Generate.flags = {
    help: command_1.flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: command_1.flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: command_1.flags.boolean({ char: 'f' }),
};
Generate.args = [{ name: 'file' }];
exports.default = Generate;
