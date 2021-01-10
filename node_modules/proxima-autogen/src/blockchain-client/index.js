const chalk = require('chalk');
const fs = require('fs-extra');

'use strict'

const packageTemplate = "";
const mainIndexTemplate = "";

function generateBlockchainClient(config) {
  fs.ensureDirSync('./blockchain-clients')
}

module.exports = {generateBlockchainClient}
