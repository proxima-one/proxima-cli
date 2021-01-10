s
`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');


//folder check


//blockchain client folder


//handlers

//proxima client

//database


//data vertex

//dapp aggregator

//check all abi
const abi_org = ["abi"
const schema_org = ["schema"]
const database_org = ["database", ["db-config.yml"]]
const blockchain_client_org = ["blockchain-client"]
const proxima_client_org = ["proxima-vertex-client"]
const dapp_aggregator_org = ["dapp-aggregator"]
const data_vertex_org = ["data-vertex"]
const docker_org = ["docker-compose.yml"]



const INIT_ORG = ["abi",
"schema",
"app-config.yml",
".proxima.yml"];
//check app config matches 

const GEN_ORG = [project,
[abi_org,
schema_org,
handlers_org,
blockchain_client_org,
proxima_client_org,
database_org]
];

const BUILD_ORG = [project,[
dapp_aggregator_org,
data_vertex_org,
docker_org]
};

function writeFolder(loc, k, obj) {
    let location = loc + "/" + k //default
    Object.keys(obj).forEach(function(key) {
        var value = obj[key];
        if (value) {
            switch (typeof value) {
                case "object":
                    writeFolder(location, key, value);
                    break;
                case "string":
                    let file = readFile(value)
                    fse.outputFile(location + "/" + key, fileValue, err => {});
                    break;
            }
        }
    })
}

function generateFolderOrg(config) {

}

//

//function checkOrganization()

module.exports = {}
