# Creating a data vertex for your project

Let's get started with Proxima by making a data vertex for our decentralized application project.
This is going to give us a fast, query layer for our application, that maintains the security of the blockchain your project is deployed on. To do this we are going to create a data vertex, which will connect to the datasources that are relevant to our DApp, transforms and loads these events into an authenticated database that can be queried through a graphQL api.
Follow along to learn how to create a data for 88mph, or use this framework to implement your own data vertex!

## Installation and Setup

Before we can begin, we have to make sure that we have installed all of the dependencies required. Check the list below to see what is needed!

#### Requirements

- npm/yarn
- docker
- docker-compose
- go

#### Installing Proxima CLI
An additional requirement for this is the Proxima CLI. Installation of the Proxima CLI can be done through yarn. This only needs to be done once. For more information on the CLI, check out the repo.
```
yarn add -g proxima-cli
```
Once the CLI is installed, you can then check the versioning.

```
proxima -v
```

## Initializing your Project

Once we have everytthing installed, it is time to begin. First navigate to an empty directory, and run the following command with the desired name of your project. It is time to initialize our project!

```
proxima init [PROJECT_NAME]
```

In this case, `[PROJECT_NAME]` is set to be `88mph-data-vertex`

This will initialize a named project directory for your data vertex `./[PROJECT_Name]`, additionally populate the project directory with:
- `abi` - the folder for smart contract abi files
- `app-config.yml` - the configuration for the data vertex
- `schema` - the folder to write your graphql schema.


## Updating datasources and schema
After initializing our project, we need to add the schema and datasources to the configuration of our data vertex. First let's look at the `app-config.yml` file, which contains the configurtions for the data vertex as well as basic information:
- `id`: id of the project
- `name`: Name of the Project
- `repo`: Owner of the project
- `description`: Descrpition of the project


### Adding your Project Schema
The first step is to determine the entities that your project will use. This is done through a GraphQL schema file. Note that it is only necessary to build the entities for the schema because the queries and mutations are generated later through the CLI.

```yaml
schema:
  file: ./schema/schema.graphql
  dir: 88mph-data-vertex/schema
```

<!--
```javascript
type Transaction {
  INT
  FLOAT
  STRING
}
```
-->

### Creation of datasources
The next step in the development process, is the creation of the datasources that will be used by our data vertex. In the `app_config.yml`, we can see the template for `datasources` with a single element. Each `datasource` contains several important components:
- `client`: this is the blockchain client used by the datasource
- `source`: this is the smart contract source used by the client
- `contracts`: these are the smart contracts that are referenced

```yaml
datasources:
  - datasource:
      name: cUSDCPool
      client:
        name: ethereum
        network: mainnet
        startBlock: 10634502
      source:
        address: '0xEB2F0A3045db12366A9f6A8e922D725D86a117EB'
        abi: DInterest
        startBlock: 11172905
      contracts:
        - name: DInterest
          file: ./abi/DInterest.json
        - name: IInterestOracle
          file: ./abi/IInterestOracle.json
        - name: ERC20
          file: ./abi/ERC20.json
        - name: MPHMinter
          file: ./abi/MPHMinter.json
```

The example above shows a our set-up of a datasource for 88mph. The name is `cUSDCPool`, it uses an ethereum client, and is using the smart contract `DInterest` which references the following smart contracts. Note: it is necessary to update the `abi` folder so that you have the correct files.

## Generating the Project
The datasources and schema we have added, will be used during the generation of the project handlers and the database schema for the data vertex. We can automatically generate these files by running:

```
proxima generate
```

This command generates a set of new folders in the project directory:
- `blockchain`: this stores the information regarding the blockchain clients. It is not necessary
Generates the correct data handlers, blockchain client, and processes the schema.
- `database` - the folder for the configuration of the database, it is composed of tables representing the entities, and provides ability to search, range, get, put
- `handlers` - the folder that represents the handlers that will be used by your data vertex's datasources.
- `schema/schema.graphql` - this represents a generated schema file that generates default queries and mutations for each entity.

This may seem like a lot of data, but don't worry we will only have change files in the **handlers** folder.

## Writing the handlers for the generated datasources
After generating the blockchain-client, the database, and the Proxima SDK plug-in, it is now possible to define the handlers for each datasource.Any of the handlers can be removed from the data vertex implementation, by removing the name from the configuration. All handlers have access to the Data Vertex Entities seen in the schema through the Proxima SDK. This allows for the updates, gets, and removes for the data. The CLI automatically generates an SDK pluy-in that enables them to interact with the entities they have within the data vertex.

### Event Handlers
What does it look like, what needs to be done?

```javascript
function EDepositHandler(event) {
   Error('Not Implemented')
}
eventHandlers.EDeposit= EDepositHandler
```



<!--  
### Block Handlers
BlockHandlers are written for each datasource, such that . They take in as input blocks, and process them.  
What does it look like?

What needs to be done?

```javascript
function blockHandler(block) {
  //traditional blockchain blockHandler()
  //indexer?
  //functionPolls()
}
```
-->


## Building the project
Once the datasource handlers have been updated, the data vertex is now ready to be built. To do this, simply run the command while in the data vertex project directory.

```
proxima build
```

This command builds the main data vertex component, the data aggregator, and the vertex client sdk plug-in to connect to the data vertex.
In addition to building these components, this command also generates a `docker-compose.yml` that is used to run the data vertex.

- `data-vertex` - the folder for smart contract abi files
- `proxima-sdk-js` - the SDK that can be used by
- `data-aggregator` - the component responsible for aggregating the datasources and their handlers, pushing them to the data vertex
- `docker-compose.yml` - the file for docker compose


## Running the project
Here comes the sweet part! On the command-line, run `proxima run` to get your server up and running. (Note: If `proxima run` does not work, run `docker-compose up`.) This will run an open ingress at:
- `ip` : `0.0.0.0`
- `port`: `4000`

```
proxima run
```

Congratulations you have a running data vertex! If you want to it locally visit.

- `GraphQL API`: `0.0.0.0:4000`
- `GraphQL Playground`: `0.0.0.0:4000/query`


## Connecting to the project
Once it is running, we can immediately connect to and receive data from the data vertex through its graphQL server, or through the Proxima SDK. If there is no concern about security it is possible to use your data vertex as a standalone server, but without the SDK it is impossible to authenticate the data given in each request.

If we use the Proxima SDK to connect to a data vertex it is possible to open up a variety of new features, most notably the abiltiy to verifiy and authenticate the data being requested. If you want to learn how to connect to a data vertex through the Proxima SDK check out our tutorial.
