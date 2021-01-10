module.exports = function (createFactory) {
  if (typeof createFactory !== 'function') {
    throw new TypeError('Expected createFactory to be react createFactory function')
  }
  return function propsMapperFunc (propsMapper) {
    if (typeof propsMapper !== 'function') {
      throw new TypeError('Expected propsMapper to be function')
    }
    return function mapPropsBaseComponent (BaseComponent) {
      const factory = createFactory(BaseComponent)
      return function propsMapperFunc (props) {
        return factory(propsMapper(props))
      }
    }
  }
}
