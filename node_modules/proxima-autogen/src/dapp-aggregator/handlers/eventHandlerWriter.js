'use strict';

var fs = require('fs');
const eventHandlersTemplate = require('../templates/eventHandlersTemplate.js');

class EventHandlersWriter {
  constructor(folder, name, template, args = {}) {
    this.name = name  || "defaultHander.js";
    this.folder = folder || "./handler/";
    this.templateFile = name || "./defaultTemplate";
    this.args = args;
    this.eventHandlers = "";
    this.templateString = this.templateString = fs.readFileSync(this.templateFile);
    this.eventHandlerFile = "";
  }

  fillTemplate() {
    this.eventHandlerFile = this.templateString.replace("//@EVENTHANDLERS", this.eventHandlers);
  }

  async writeEventHandler() {
    this.fillTemplate();
    await fs.writeFile(this.folder + this.name, this.eventHandlerFile);
  }

  addEvent(contractEvent) {
    this.eventHandlers += createEventHandler(chunk);
  }

  createEventHandler(contractEvent) {
    let eventHandlerString = "\n \n"
    eventHandlerString += "function " + contractEvent.name + "Handler"
    eventHandlerString += "(event) {\n"
    eventHandlerString += "Error('Not Implemented')\n"
    eventHandlerString += "}\n"
    eventHandlerString += "eventHandler." + contractEvent.name + "=" + + contractEvent.name + "Handler";
    return eventHandlerString
  }
}
