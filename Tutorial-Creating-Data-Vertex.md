# Integrating the blockchain 
Requirements 



## Initializing the Project 

### Command 
 proxima init 88mph-data-vertex

### What does it do ? 
- Abi
- app-config.yml	
- Schema


## Updating datasources and schema 

### What does the user need to do
- Schema 
- Add their schema files 
- Datasources 
- Project information 
- ABI 

#### App_config (project information)

#### Variables 

#### Schema 

#### Datasources 

## Generating the Project 
The project vertex is ready to be generated after you have updated the datasources, abi, and schema. This is done by running:

`proxima generate`

### What does it do? 
Generates the correct data handlers, blockchain client, and processes the schema 


## Writing the handlers for the generated datasources 
After generating the blockchain-client, the database, and the proxima sdk plug-in, it is now possible to define the handlers for each datasource.


### Using the SDK with data vertex handlers


## Handlers 

### Block Handlers

What does it look like, what needs to be done?

Example:

### Event Handlers 
What does it look like, what needs to be done?

Example:

### Transaction Handlers 
What does it look like, what needs to be done?

Example:

## Building the project 
Once the datasource handlers have been updated, the data vertex is now ready to be built. To do this, simply run the command while in the data vertex project directory.

`proxima build`

### What does it do? 
Builds the proxima data vertex, including the files



## Running the project 

`proxima run`

or 

`docker-compose up`

### Playground api 


### API Gateway
port 
ip


## Other topics
- Testing and Benchmarking the project 
- Deployment of the project, usage of SDK
- Connecting to projects 
