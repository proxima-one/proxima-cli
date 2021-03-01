'use strict'
var fs = require('fs-extra');
const yaml = require('js-yaml');
const eventTemplate = (fs.readFileSync(require.resolve("../templates/eventHandlersTemplate.js"))).toString();
const functionTemplate = (fs.readFileSync(require.resolve("../templates/functionHandlersTemplate.js"))).toString();


class EthereumSmartContractInterpreter {

constructor(abi, outputFolder, fnTemplateString = functionTemplate, eventTemplateString = eventTemplate) {
  this.abi = abi
  this.outputFolder = outputFolder
  this.fnTemplateString = fnTemplateString;
  this.eventTemplateString= eventTemplateString;
  let resp = this.processSmartContractABI();
  this.events = resp.events
  this.fnEvents = resp.fnEvents
}


processSmartContractABI() {

 let events = []
 let fnEvents = []
 for (let i = 0; i < this.abi.length; i++) {
   let chunk = this.abi[i]
   switch(chunk.type) {
     case 'event':
      events.push(chunk)
       break;
     case 'function':
      fnEvents.push(chunk)
       break;
     }
  }
 return {events, fnEvents}
}

generateHandlers() {
  let functionHandlers = this.generateFunctionHandlers();
  let eventHandlers = this.generateEventHandlers();
  return {functionHandlers, eventHandlers}
}

generateFunctionHandlers() {
  let templateString = this.fnTemplateString
  let functionHandlerText = ""
  for (const functionEvent of this.fnEvents) {
    functionHandlerText += this.generateFunctionHandlerText(functionEvent)
  }
  fs.outputFileSync(this.outputFolder + "/functionHandlers.js", templateString.replace("//@FUNCTIONHANDLERS", functionHandlerText));
  return this.outputFolder + "/functionHandlers.js"
}

generateEventHandlers() {
  let templateString = this.eventTemplateString
  let eventHandlerText = ""
  for (const contractEvent of this.events) {
    eventHandlerText += this.generateEventHandlerText(contractEvent)
  }
  fs.outputFileSync(this.outputFolder + "/eventHandlers.js", templateString.replace("//@EVENTHANDLERS", eventHandlerText));
  return this.outputFolder + "/eventHandlers.js"
}

generateEventHandlerText(contractEvent) {
  let eventHandlerString = "\n \n"
  eventHandlerString += "function " + contractEvent.name + "Handler"
  eventHandlerString += "(event) {\n"
  eventHandlerString += "Error('Not Implemented')\n"
  eventHandlerString += "}\n"
  eventHandlerString += "eventHandlers." + contractEvent.name + "= " + contractEvent.name + "Handler";
  return eventHandlerString
}

 

generateFunctionHandlerText(contractFunction) {
    let functionHandlerString = "\n \n"
    functionHandlerString += "function " + contractFunction.name + "FunctionHandler"
    functionHandlerString += "(blockNumber, blockHead) {\n"
    functionHandlerString += "Error('Not Implemented')\n"
    functionHandlerString += "}\n"
    functionHandlerString += "functionHandlers." + contractFunction.name + "=" + contractFunction.name + "FunctionHandler;"
    return functionHandlerString
  }
}


module.exports = {
  EthereumSmartContractInterpreter
}
