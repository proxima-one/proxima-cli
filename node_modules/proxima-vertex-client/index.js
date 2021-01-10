/*
Proxima Client to be used for accessing Proxima repositories
*/

const Proxima = require("./src/proxima/index.js");
const Subgraph = require("./src/subgraph/index.js")
const Proofs = require("./src/proof/index.js");

module.exports = {
  Proxima,
  Subgraph,
  Proofs
};
