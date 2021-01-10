const identity = require('../identity')

module.exports = function (createFactory) {
  if (typeof createFactory !== 'function') {
    throw new TypeError('Expected createFactory to be react createFactory function')
  }
  return function createFactoryPermute (test, left, right = identity) {
    if (typeof test !== 'function') {
      throw new TypeError('Expected test to be function')
    }
    if (typeof left !== 'function') {
      throw new TypeError('Expected left to be function')
    }
    return function permuteBaseComponent (BaseComponent) {
      let leftFactory
      let rightFactory
      return function permuteProps (props) {
        if (test(props)) {
          leftFactory = leftFactory || createFactory(left(BaseComponent))
          return leftFactory(props)
        }
        rightFactory = rightFactory || createFactory(right(BaseComponent))
        return rightFactory(props)
      }
    }
  }
}
