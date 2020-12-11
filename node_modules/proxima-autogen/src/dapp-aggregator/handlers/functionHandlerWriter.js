'use strict';

var fs = require('fs');

class FunctionHandlerWriter {
  constructor(folder, name, template, args = {}) {
    this.name = name  || "defaultHander.js";
    this.folder = folder || "./handler/";
    this.templateFile = name || "./defaultTemplate";
    this.args = args;
    this.functionHandlers = "";
    this.templateString = this.templateString = fs.readFileSync(this.templateFile);
    this.functionHandlerFile = "";
  }

  fillTemplate() {
    this.functionHandlerFile = this.templateString.replace("//@FUNCTIONHANDLERS", this.functionHandlers);
  }

  async writeEventHandler() {
    this.fillTemplate();
    await fs.writeFile(this.folder + this.name, this.eventHandlerFile);
  }

  addFunction(contractEvent) {
    this.functionHandlers += createFunctionHandler(chunk);
  }

  createFunctionHandler(contractFunction) {
    let eventHandlerString = "\n \n"
    eventHandlerString += "contract " + contractFunction.name + "FunctionHandler"
    eventHandlerString += "(blockNumber, blockHead) {\n"
    eventHandlerString += "Error('Not Implemented')\n"
    eventHandlerString += "}\n"
    eventHandlerString += "functionHandler." + contractFunction.name + "= contract" + + contractFunction.name + "FunctionHandler;";
    return eventHandlerString
  }
}
