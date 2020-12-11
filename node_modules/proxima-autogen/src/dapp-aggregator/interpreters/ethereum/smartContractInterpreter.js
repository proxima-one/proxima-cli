'use strict'
var fs = require('fs');
const yaml = require('js-yaml');

const eventSchema = './schema/events.graphql';
const eventHandlers = './smartContractFiles/eventHandlers.js';



const eventQueries;
const eventResolvers;


const smartContractFunctions = './smartContractFiles/eventHandlers.js';


function getSmartContractABI() {
  const environment = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
  const abiCode = require(environment.abi);
  return abiCode;
}

function processSmartContractABI(abi) {
 events = {}
 functions = {}
 for (let i = 0; i < abi.length; i++) {
   let chunk = abi[i]
   switch(chunk.type) {
     case 'event':
       console.log('event', chunk.name)
       eventProcessor.addEvent(chunk)
       break;
     case 'function':
       console.log("function", chunk)
       if (chunk.constant) {
         console.log("function", chunk)
         //smartContractFunctions += createSmartContractFunction(chunk)
       }
       break;
     default:
       console.log(chunk.type)
     }
  }
  await eventProcessor.save()
 return events, functions
}




module.exports = {
  main
}
