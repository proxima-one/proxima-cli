import {Command, flags} from '@oclif/command'


/*
  This must generates the code from the config file:
  - Server for Graphql (Should be the query node)
  - Generates Schema + Graphql types
  - Events
  - Handlers (for graphql)
  - Types + Query Resolvers
  - Verification, Authentication, Audit handlers of data (Client needs this as well)
  - Datasources/Subgraphs
  - Database Resolvers
  - Database (Should be the query node)
  - Peer-to-Peer mesh eventually (should be the query node)
*/

export default class Generate extends Command {

  static description = 'generates the types, schemas, and handlers from the configuration file'

  static examples = [
    `$ proxima hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Generate)

    const name = flags.name || 'world'
    this.log(`hello ${name} from ./src/commands/hello.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
