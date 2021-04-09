
## Organization
- Names and configuration
  - Authorization
  - Name and identifier
  - version
- *Query handling*
  - schema
  - resolvers
  - query handling
- *Database*
  - tables creation (with cache


- *DApp aggregator*
  - handlers for blockchain events
  - blockchain client
  - smart contract abi
  - mutation/updates to schema entities (client schema)
## Configuration
  - database config
  - name config
  - aggregator configs
  - organization config
  - Volume mount
  - config cache, batch processing


docker-componse up (config)


### Query (query the database with the assumption that the data is being passed back as a model)
- Provide the default query inputs for the query table (args)
- Given from model resolver

### Database Resolver/Model Push
- process the models, so that they can be resolved from JSON, with special respect to the proofs

### Database + Cache
- if not found then get from database and set in the cache
return the value
