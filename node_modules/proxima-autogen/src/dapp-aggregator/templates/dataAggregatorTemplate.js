'use strict'

const fs = require('fs-extra');
const generatedVertexClient = require('./vertex-client/index.js');
const blockchainClients = require('general-blockchain-client');
const yaml = require('js-yaml');

function init_datasource(datasource_config, clients, vertexClient) {
  var datasource;
  var type;
  let name = datasource_config.name
  let contracts = {}
  for (const contract of datasource_config.contracts) {
    contracts[contract.name] = fs.readFileSync(contract.file)
  }
  let abi = contracts[datasource_config.source.abi];
  let handlers = require(datasource_config.handlers.dir);
  let client = clients.get(datasource_config.client.name, datasource_config.client.network)
  if (datasource_config.source.address) {
    let address = datasource_config.source.address;
    return {"datasource" : new Datasource(name, address, abi, contracts, handlers, client, vertexClient)}
  } else {
    return {"template": new DatasourceTemplate(name, abi, contracts, handlers, client, vertexClient)}
  }
}

function main() {
  let config = yaml.safeLoad(fs.readFileSync('./app-config.yml'));
  let name = config.name;
  let vertexClient = generatedVertexClient.init(); //vertex
  let clients = blockchainClients.init(config); //clients config

  let templates = {}
  let datasources = {}

  for (var datasource of config.datasources) {
    let datasource_config = datasource;
    let resp = init_datasource(datasource_config, clients, vertexClient);
    if (resp.datasource) {
      datasources[datasource_config.name] = resp.datasource
    } else {
      templates[datasource_config.name] = resp.template
    }
  }
  aggregator.init(name, blockchainClients, datasources, templates, vertexClient, config);
}
