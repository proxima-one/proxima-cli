import {Command} from '@oclif/command'
export class Build extends Command {

  /*
    This builds the subgraph after it is deployed
    - Validation
    - Testing ... (potentially) -flag
    - Compilation (Web assembly, etc)
    - Optional (can install node modules) -flag
    - Can generate docker container  -flag
  */

  static description = 'compiles the subgraph'
  async run() {
    console.log('Building')
  }
}
