'use strict'

//import the entities
//import functions

let eventHandlers = {};

@EVENTHANDLERS


function handleEvent(event) {
  if (eventHandlerDictionary.contains(event.name)) {
    eventHandlers[event.name](event)
  }
}

module.exports = handleEvent;
