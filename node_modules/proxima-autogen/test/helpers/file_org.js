
`use strict`
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const yaml = require('js-yaml');

const INIT_FOLDER_ORG = {project_name: "Default",
{abi: "abi",
schema: "schema",
proxima: "",
application_config: ".proxima_config.yml",
config: {
  db: "",
  client: "",
   dataVertex: "",
  aggregator: ""
}}
};

const GEN_FOLDER_ORG = { project_name: "Default",
handlers: {
  events: {
    contract: "",
    blockchain: ""
  },
  functions: ""
}
};

const BUILD_FOLDER_ORG = {project_name: "Default",
docker: {
aggregator: "aggregator_builer.sh",
dataVertex: "dataVertex_builder.sh",
client: "client_builder.sh",
database: "database_builder.sh"
}
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

module.exports = {INIT_FOLDER_ORG,
  GEN_FOLDER_ORG,
  BUILD_FOLDER_ORG
}
