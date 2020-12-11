# Proxima Auto-generation

This repository is responsible for the auto-generation within the Proxima Network. It encapsulates processing of smart contracts for the DApp aggregators, creation of models, resolvers, and Data Vertices for the Proxima Node, and the building of the Proxima Vertex node itself.

The auto-generator occurs in several stages:
- Autogeneration of DApp Aggregator
- Generation of schema files

#### Requirements
- Schema files
- Blockchain Smart contracts


## Ordering of commands





## Interpreter

### Smart Contracts
- Event handlers
- Function handlers
- Contract creators

### Schema Modification


## Builder
Works with:
- DApp aggregator
- Blockchain Client
- Data vertex
- Database
  - Volume

### Processes
- Creates the docker-compose files
- Creates the correct config files for:
  - Database
  - Blockchain Client
  - Data vertex
  - DApp aggregator
- Creates the




## DApp aggregator

#### Requirements
- Graphql Schema files

#### Configuration
- DApp aggregator configuration
  - Blockchain client configuration
  - Data client vertex configuration  

#### Uses
- Blockchain client
- Data vertex Client

## Blockchain Client
Select and create client from config
#### Requirements
- Graphql Schema files

#### Configuration
- Blockchain client configuration

## Data vertex graphql client

#### Configuration
- Data client vertex configuration

#### Requirements
- Graphql Schema files


## Proxima Graphql
The Proxima graphql generation relies on the creation of the dataloader, the models and resolvers, and a connection and reference to the database tables  through a client.

#### Requirements
- Graphql Schema files

#### Configuration
- Data vertex configuration
- Database client configuration

#### Uses
- Database client  

### Generation
Files to be created:
- Models
- Default query inputs
- Resolvers
- Dataloader
- Database tables
- Server files

#### Models and resolver generation
The golang model and resolver generator runs a bash file that occurs in two stages:
- First it runs gql generator to create the models and resolvers from the schema file
- Second it runs a node file that adds the proper code to:
  - Writes the base default query and resolver inputs for each query with the default entries
  - Writes the resolvers to include the correct dataloaders.

#### Dataloader
The Proxima dataloader is generated


## Database

#### Needed Configuration files
- Database configuration

#### Requirements for generation
- Graphql Schema files

### Generation
Files to be generated:
- Database tables
- Table config
- Cache config
- Default database configuration

#### Database tables
The database table client is used by the dataloader, and must incorporate the correct dataloader for the correct models.

### Database Configuration
The Proxima generator creates the

### Cache Configuration
The Proxima generator creates the tables and their respective caches for the

Create the table list and the cache list for the database
