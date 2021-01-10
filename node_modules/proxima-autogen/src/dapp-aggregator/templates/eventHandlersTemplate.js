'use strict'

const vertexClient = require(vertexClientFile); //
//import functions

let eventHandlers = {};

//@EVENTHANDLERS


function handleEvent(event) {
  if (eventHandlerDictionary.contains(event.name)) {
    eventHandlers[event.name](event)
  }
}

module.exports = handleEvent;
