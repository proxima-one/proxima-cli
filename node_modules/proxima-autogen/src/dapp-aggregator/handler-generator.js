//
'use strict';
const fs = require("fs-extra");
const {EthereumSmartContractInterpreter} = require('./interpreters/ethereumSmartContractInterpreter.js');

const mainHandlerTemplate = (fs.readFileSync(require.resolve('./templates/mainHandlerTemplate.js'))).toString();
const blockHandlerTemplate = (fs.readFileSync(require.resolve('./templates/blockHandlers.js'))).toString()
const transactionHandlerTemplate = (fs.readFileSync(require.resolve('./templates/transactionHandlers.js'))).toString()


function generateHandlers(abi, outputFolder) {
  let interpreter = new EthereumSmartContractInterpreter(abi, outputFolder);
  let resp = interpreter.generateHandlers();
  fs.writeFileSync(outputFolder + "/blockHandler.js", blockHandlerTemplate)
  fs.writeFileSync(outputFolder + "/transactionHandler.js", transactionHandlerTemplate)
  fs.writeFileSync(outputFolder + '/index.js', mainHandlerTemplate)
  let handlers = {
    main: outputFolder + "/index.js",
    blockHandler: outputFolder + "/blockHandler.js",
    transactionHandler: outputFolder + "/transactionHandler.js",
    eventHandlers: resp.eventHandlers,
    functionHandlers: resp.functionHandlers
  }
  return handlers
}



module.exports = {generateHandlers}



// require("graphql/language");
//
// const chalk = require('chalk');
// const fs = require('fs-extra');
// const yaml = require('js-yaml')
// const dockerFileTemplate = require('./dockerfile')
// // const gql = require('graphql-tag');
