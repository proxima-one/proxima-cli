'use strict'

//@ENTITIES
//@EVENTS

let functionHandlers = {};

//@FUNCTIONHANDLERS

function handleFunction(blockNumber, blockHead) {
  for (var i in functionHandlers) {
    functionHandlers[i].(blockNumber, blockHead);
  }
}

module.exports = handleFunction;
