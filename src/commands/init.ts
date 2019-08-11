import {Command} from '@oclif/command'

export class Init extends Command {
  /*
    This must initialize the:
    - Directory with name
    - Config file
      - Must be pre-scaffolded with information
    - package.json
      - Must be pre-loaded with information
    - Subdirectories
      - "src"
      - "test"
      - "docs"
  */
  static description = 'initializes a directories for the proxima subgraph'

  async run() {

    console.log('Initializing')
  }
}
