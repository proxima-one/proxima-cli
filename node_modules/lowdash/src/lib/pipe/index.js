const identity = require('../identity')

module.exports = function (...funcs) {
  if (funcs.length === 0) {
    return identity
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduceRight((a, b) => (...args) => a(b(...args)))
}
