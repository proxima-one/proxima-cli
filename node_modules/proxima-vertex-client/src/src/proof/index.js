
'use strict';

var Proof = require("./proof.js");
var Common = require("./common");
const bcrypto = require('bcrypto');
const {BLAKE2b} = bcrypto;
var assert = require('bsert');
var _ = require("lodash")

function verify(value, rawProof) {
  try {
    let {proof, root, key, proof_value}  = parseProof(rawProof)
    checkValue(proof_value, value)
    let [code, data] = proof.verify(root, key, BLAKE2b, 256)
    return (code === 0)
  } catch(err) {
    console.log(err)
    return false
  }
}

function parseProof(rawProof) {
  let proofJSON = JSON.parse(rawProof.proof)
  let proof = new Proof()
  proof.fromJSON(proofJSON, BLAKE2b, 256)
  let value = JSON.parse(Buffer.from(proofJSON.value, 'hex').toString())
  let key = Buffer.from(proofJSON.key_value, 'hex')
  let root = Buffer.from(rawProof.root, 'hex')
  return {proof: proof, root: root, key: key, proof_value: value}
}

function checkValue(proof_value, value) {
  if (_.isEqual(proof_value, value)) {
  return true
  }
for (var key in value) {
  if (_.isEqual(proof_value[key], value[key])) {
    return true
  }
}
return false
}

module.exports = {
  Proof,
  checkValue,
  parseProof,
  verify}
