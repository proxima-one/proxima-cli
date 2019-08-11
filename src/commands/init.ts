import {Command} from '@oclif/command'
import * as fs from 'fs-extra';
import * as prettier from 'prettier'


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
prettier.format()
*/
  async package() {
    var package_contents = prettier.format(`{package: contents,
      contents: next,
      contents: next,
      contents: next
    }
    `, { parser: 'json' })
    await fs.outputFile("directory/package.json", package_contents)
  }


/*
Make Package file
*/

  async configuration() {
    var config_contents = prettier.format(`
      package: contents
      contents: next
    `, {parser: 'yaml' })
    await fs.outputFile("directory/config.yml", config_contents)
  }



  async run() {
    console.log('Initializing')
    await this.scaffold();
    await this.package();
    await this.configuration();
  }
}
