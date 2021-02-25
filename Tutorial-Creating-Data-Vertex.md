# Creating a data vertex for your project





## Installation and Setup

> Hardware Requirements:
>

#### Requirements



#### Installing Proxima CLI
Installation of the Proxima CLI can be done through yarn. This only needs to be done once. For more information on the CLI, check the repo.
```
yarn add -g proxima-cli
```
Once the CLI is installed, you can then check the versioning.

```
proxima -v
```

## Initializing your Project

It is time to initialize our project.

```
proxima init [PROJECT_NAME]
```

In this case, `[PROJECT_NAME]` is set to be `88mph-data-vertex`

This will initialize a named project directory for your data vertex.
- `abi` - the folder for smart contract abi files
- `app-config.yml` - the configuration for the data vertex
- `schema` - the folder to write graphql schema.


## Updating datasources and schema
Before

#### App Config
First look at the `app-config.yml` file, which is responsible

- `id`: string the
- `name`: Name of the Project
- `owner`:
- `description`:

### Schema
The schema files are done through graphql ,
Note, it is only necessary to generate the
See the graphql documentation here.

`schema/schema.graphql`


**Example**

```javascript
type Transaction {
  INT
  FLOAT
  STRING
}
```


### Creation of datasources



The next step is the creation of the datasources.
- `name`:
- `(information)`:
- `client`:

The client refers to
(can then be used in datasources)

- `abi`:
(ABI)
`abi/schema.`
Adding the ABI

**Example**
```yaml
datasources:
  - datasource:
      name: cUSDCPool
      client:
        name: ethereum
        network: mainnet
        startBlock: 10634502
      source:
        address: "0xEB2F0A3045db12366A9f6A8e922D725D86a117EB"
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


## Generating the Project
The project vertex is ready to be generated after you have updated the datasources, abi, and schema. This is done by running:

```
proxima generate
```

This command generates a set of new folders in the project directory:
- `blockchain`: this stores the information regarding the blockchain clients. It is not necessary
Generates the correct data handlers, blockchain client, and processes the schema.
- `database` - the folder for smart contract abi files
- `handlers` - the folder for smart contract abi files
- `schema/schema.graphql` - this represents the new values. Gives (search, range, get, put)



## Writing the handlers for the generated datasources
After generating the blockchain-client, the database, and the Proxima SDK plug-in, it is now possible to define the handlers for each datasource.

### Handlers
Any of the handlers can be removed from the data vertex implementation, by removing the name from the configuration.

All handlers have access to the Data Vertex Entities seen in the schema through the Proxima SDK. This allows for the updates, gets, and removes for the data.

**Example**
```

```

The CLI automatically generates the


#### Block Handlers
BlockHandlers are written for each datasource, such that . They take in as input blocks, and process them.  
What does it look like, what needs to be done?

```

```

**Example**
```

```

#### Event Handlers
What does it look like, what needs to be done?

```

```

Example:
```

```

#### Transaction Handlers
Transactions associated with datasources
What does it look like, what needs to be done?

```

```

Example:
```

```

## Building the project
Once the datasource handlers have been updated, the data vertex is now ready to be built. To do this, simply run the command while in the data vertex project directory.

```
proxima build
```

This command will generate folders for the proxima data vertex, including the files:



- `data-vertex` - the folder for smart contract abi files
- `docker-compose.yml` - the folder for docker compose



## Running the project
```
proxima run
```
or
```
docker-compose up
```

- `IP`: 0.0.0.0
- `Port`: 4000
- `Playground`: 0.0.0.0:4000/query


## Other topics
- Testing and Benchmarking the project
- Deployment of the project, usage of SDK
- Connecting to projects
