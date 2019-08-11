import {Command} from '@oclif/command'
import * as fs from 'fs-extra';

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


/*
Make directories
- Name
- src folder
- test folder
- config
- package
*/
  async scaffold() {
    await fs.mkdir("directory")
    await fs.mkdir("directory/src")
    await fs.mkdir("directory/test")
  }


/*
Make config file
*/
  async package() {
    await fs.outputFile("directory/package.json", "package.json")
  }


/*
Make Package file
*/

  async configuration() {
    await fs.outputFile("directory/config.yml", "config")
  }



  async run() {
    console.log('Initializing')
    await this.scaffold();
    await this.package();
    await this.configuration();
  }
}
