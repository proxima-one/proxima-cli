"use strict";
var fs = require("fs-extra");
const yaml = require("js-yaml");
const eventTemplate = fs
  .readFileSync(require.resolve("../templates/eventHandlerFnTemplate.ts"))
  .toString();
const functionTemplate = fs
  .readFileSync(require.resolve("../templates/functionHandlersTemplate.js"))
  .toString();

const NotImplementedString = "Error('Not Implemented')";

class EthereumSmartContractInterpreter {
  constructor(
    abi,
    outputFolder,
    fnTemplateString = functionTemplate,
    eventTemplateString = eventTemplate
  ) {
    this.abi = abi;
    this.outputFolder = outputFolder;
    this.fnTemplateString = fnTemplateString;
    this.eventTemplateString = eventTemplateString;
    let resp = this.processSmartContractABI();
    this.events = resp.events;
    this.fnEvents = resp.fnEvents;
  }

  processSmartContractABI() {
    let events = [];
    let fnEvents = [];
    for (let i = 0; i < this.abi.length; i++) {
      let chunk = this.abi[i];
      switch (chunk.type) {
        case "event":
          events.push(chunk);
          break;
        case "function":
          fnEvents.push(chunk);
          break;
      }
    }
    return { events, fnEvents };
  }

  getEvents() {
    return this.processSmartContractABI().events;
  }

  generateHandlers(fnBody = NotImplementedString) {
    let functionHandlers = this.generateFunctionHandlers(fnBody);
    let eventHandlers = this.generateEventHandlers(fnBody);
    return { functionHandlers, eventHandlers };
  }

  generateFunctionHandlers(fnBody = NotImplementedString) {
    let templateString = this.fnTemplateString;
    let functionHandlerText = "";
    for (const functionEvent of this.fnEvents) {
      functionHandlerText += this.generateFunctionHandlerText(
        functionEvent,
        fnBody
      );
    }
    //fs.outputFileSync(
    //  this.outputFolder + "/functionHandlers.js",
    //  templateString.replace("//@FUNCTIONHANDLERS", functionHandlerText)
    //);
    return functionHandlerText;
  }

  generateEventHandlers(fnBody) {
    let templateString = this.eventTemplateString;
    let eventHandlerText = "";
    //let  import
    //update
    for (const contractEvent of this.events) {
      eventHandlerText += this.generateEventHandlerText(
        contractEvent,
        fnBody,
        templateString
      );
    }
    // fs.outputFileSync(
    //   this.outputFolder + "/eventHandlers.js",
    //   templateString.replace("//@EVENTHANDLERS", eventHandlerText)
    // );
    return eventHandlerText;
  }
  //Needs to be updated, typescript, replace names
  generateEventHandlerText(
    contractEvent,
    fnBody = NotImplementedString,
    templateString = eventTemplate
  ) {
    //replace
    let eventHandlerString = eventTemplate
      .split("$EventName")
      .join(contractEvent.name)
      .replace("$body;", fnBody);

    // eventHandlerString +=
    //   "eventHandlers." +
    //   contractEvent.name +
    //   "= " +
    //   contractEvent.name +
    //   "Handler";
    return eventHandlerString;
  }

  generateFunctionHandlerText(contractFunction, fnBody = NotImplementedString) {
    let functionHandlerString = "\n \n";
    functionHandlerString +=
      "function " + contractFunction.name + "FunctionHandler";
    functionHandlerString += "(blockNumber, blockHead) {\n";

    functionHandlerString += fnBody;
    functionHandlerString += "\n}\n";
    functionHandlerString +=
      "functionHandlers." +
      contractFunction.name +
      "=" +
      contractFunction.name +
      "FunctionHandler;";
    return functionHandlerString;
  }
}

module.exports = {
  EthereumSmartContractInterpreter,
};
