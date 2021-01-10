const curry = require('../curry')

module.exports = curry(function (tag, x) {
  console.log(tag, x)
  return x
})
