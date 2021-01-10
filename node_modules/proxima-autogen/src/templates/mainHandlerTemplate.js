'use strict';

const blockHandlers = require('./blockHandlers.js');
const eventHandlers = require('./eventHandlers.js');
const transactionHandlers = require('./transactionHandlers.js');
const functionHandlers = require('./functionHandlers.js');

module.exports = {"Block": blockHandlers, "Event": eventHandlers, "Transaction":transactionHandlers, "Function": functionHandlers};
