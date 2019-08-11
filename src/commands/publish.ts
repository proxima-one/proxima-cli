import {Command} from '@oclif/command'
export class Publish extends Command {

/*
This publishes the subgraph to an index node. Included in this:
- Config file
- Resolvers, etc, Except no database or server
- Needs authentication/Authorization
*/
  static description = 'publishes subgraph to the proxima network'

  async run() {
    console.log('Publishing')
  }
}
