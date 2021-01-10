module.exports = function (createFactory) {
  if (typeof createFactory !== 'function') {
    throw new TypeError('Expected createFactory to be react createFactory function')
  }
  return function castComponents (...components) {
    const factories = components.map(createFactory)
    return function castProps ({children, ...props}) {
      return factories.reduceRight((child, factory) => factory(props, child), children)
    }
  }
}
