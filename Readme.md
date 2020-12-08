

# Proxima Project Creation

Creating a project.

<!--

init

generate

build

run

publish
remove
deploy
-->

#### Install Proxima Command-line-interface

```
yarn add -g proxima-cli
```

## Initialize Project

```
proxima init PROJECT_NAME
```

Output Directory
```
PROJECT_NAME
+ contracts
  - abi files here
+ schema
  - schema files here
+ config
  - config
```

### Contracts
You can include the raw text of the ABI code. For this instance, we have already loaded an abi code for the IDEX exchange.
Featured in abi/idex_abi.json.



## Add code Project

- code to be generated
```
+ contracts
  - smartcontract1_name.json
  - smartcontract2_name.json
```

- config update

#### Update Config

For now we look at the config.yml to include the contract address, the abi code, and datasource.


```yaml
name: [smart contract name]
abi: ./abi/idex_abi.json
contract: '0x2a0c0DBEcC7E4D658f48E01e3fA353F44050c208'
datasource: Ethereum
id: ID
owner: Owner
```

#### Clients

#### Schema creation

- create the schema



## Generating project code

```
proxima generate
```

This generates the smart contract handlers (shown in DApp aggregator, and entities)

Output Directory
```
PROJECT_NAME
+ DApp aggregator
  - smartcontract1_name
    - functionHandlers
    - eventHandlers
  - smartcontract2_name
    - ...
    - ...
```



## Filling out function and eventHandlers





## Building Project
```
proxima build TYPE
```
- config setup
- remote building of the container ...
- if local then pulls dockerfiles, builds the containers, tags them
- creates the docker compose file
- creates the ID and address


## Running the project

### Starting
```
proxima start ID/NAME
```

```
Starting the node....
Server is running on http://localhost:4000
```

### Stopping
```
proxima stop ID/NAME
```

```
Stopping the node....
Server is running on http://localhost:4000
```

### Deploying the project
```
proxima deploy ID/NAME
```

Response of success, with id/name

### Pulling previous project
```
proxima pull ID/NAME
```


## Advanced Configurations

### Database

```yaml
name: [YOUR Name]
abi: ./abi/idex_abi.json
contract: '0x2a0c0DBEcC7E4D658f48E01e3fA353F44050c208'
datasource: Ethereum
id: ID
owner: Owner
```

### Cache
```yaml
name: [YOUR Name]
abi: ./abi/idex_abi.json
contract: '0x2a0c0DBEcC7E4D658f48E01e3fA353F44050c208'
datasource: Ethereum
id: ID
owner: Owner
```

### Client
```yaml
name: [YOUR Name]
abi: ./abi/idex_abi.json
contract: '0x2a0c0DBEcC7E4D658f48E01e3fA353F44050c208'
datasource: Ethereum
id: ID
owner: Owner
```
