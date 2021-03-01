'use strict'

const vertexClient = require(vertexClientFile); //
//import functions

let eventHandlers = {};


 
function EDepositHandler(event) {
Error('Not Implemented')
}
eventHandlers.EDeposit= EDepositHandler
 
function EFundHandler(event) {
Error('Not Implemented')
}
eventHandlers.EFund= EFundHandler
 
function ESetParamAddressHandler(event) {
Error('Not Implemented')
}
eventHandlers.ESetParamAddress= ESetParamAddressHandler
 
function ESetParamUintHandler(event) {
Error('Not Implemented')
}
eventHandlers.ESetParamUint= ESetParamUintHandler
 
function EWithdrawHandler(event) {
Error('Not Implemented')
}
eventHandlers.EWithdraw= EWithdrawHandler
 
function OwnershipTransferredHandler(event) {
Error('Not Implemented')
}
eventHandlers.OwnershipTransferred= OwnershipTransferredHandler


function handleEvent(event) {
  if (eventHandlerDictionary.contains(event.name)) {
    eventHandlers[event.name](event)
  }
}

module.exports = handleEvent;
