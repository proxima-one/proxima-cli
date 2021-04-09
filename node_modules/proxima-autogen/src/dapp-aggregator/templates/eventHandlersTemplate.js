"use strict";

const vertexClient = require(vertexClientFile); //
//import functions

let eventHandlers = {};

//@EVENTHANDLERS, exports

function handleEvent(event) {
  if (eventHandlerDictionary.contains(event.name)) {
    eventHandlers[event.name](event);
  }
}

//@BLOCKHANDLER
function handleBlock(block) {}

module.exports = handleEvent;
