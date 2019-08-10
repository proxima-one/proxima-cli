

import {Command} from '@oclif/command'
export class GoodbyeCommand extends Command {
  async run() {
    console.log('goodbye, world!')
  }
}

module.exports = GoodbyeCommand
