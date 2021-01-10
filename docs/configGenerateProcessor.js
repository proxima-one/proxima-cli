const fs = require('fs-extra');
const yaml = require('js-yaml');



function main(file = "./config.yml") {
  let config = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));
  //config.common = common(config) //sets-up the mappings
  //common, update the config to match
  //common, update the config to match
  schema(config)
  clients(config)
  dappAggregator(config)
}

function clients(config){
  let clientList = config.clients
  //for client in client config list
  processClient(clientConfig)
}

function processClient(clientConfig) {
  //create the clients...
  //write clients
}

function schema(config) {
  let file = config.schema.file
  let schemaFile = fs.readFile(file)
  processSchema(schemaFile)
}


function processSchema(schema) {
//this is the schema processing and entity processing file
}

function dappAggregator(config) {
  let dappConfig = fetchDAppAggregatorConfig(config)
  processDAppAggregator(dappConfig)
}

function processDAppAggregator(config) {
  //write all of the datasources to the file
  //process Clients
}

function processDatasource(datasourceConfig) {
  //datasource directory
  let datasourceHandlers = datasourceConfig.handlers
  processDatasourceClient(datasourceConfig.client)
  processDatasourceType(datasourceConfig);
}

function processDatasourceClient(clientConfig) {
  //write the client file client.js
  //make the client
}

function processDatasourceType(datasourceConfig) {
  //do the same thing
  if (datasourceConfig.source) {
    processSource(datasourceConfig)
    //write source
  } else {
    processTemplate(datasourceConfig)
  }
}

function processSource(config) {
  let smartContracts = datasourceConfig.contracts
  let smartContract = datasourceConfig.template.abi
}

function processTemplate(config) {
  let smartContracts = datasourceConfig.contracts
  let smartContract = datasourceConfig.template.abi
}

function processSmartContracts(smartContractConfig, smartContract) {
  //fetchSmartContract(MooniSwap)
}

function fetchSmartContract(smartContractConfig) {
  //
}
