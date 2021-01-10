'use strict'

//@ENTITIES
//@EVENTS

let functionHandlers = {};

//@FUNCTIONHANDLERS

function handleFunction(blockNumber, blockHead) {
  for (var fn of functionHandlers) {
    fn(blockNumber, blockHead);
  }
}

module.exports = handleFunction;
