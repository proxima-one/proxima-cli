import {Command} from '@oclif/command'
export class Deploy extends Command {
  /*
    Options:

    - Deploy Local (flag)
      - npm/yarn install for dependencies
      - npm run node ...
    - Deploy to our thing (flag)
      - Must build + publish first
      - Must have account (Auth)
      - Load the subgraph to the Contract with Deploy configs (replication, etc)
  */


  static description = 'deploys the subgraph to be run by the network, or locally'

  async run() {
    console.log('Deploying')
  }
}
