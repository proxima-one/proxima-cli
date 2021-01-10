const mapProps = require('../mapProps')

module.exports = function (createFactory) {
  if (typeof createFactory !== 'function') {
    throw new TypeError('Expected createFactory to be react createFactory function')
  }
  return function withPropsFunc (createProps) {
    return mapProps(createFactory)(props => ({
      ...props,
      ...(
        typeof createProps === 'function'
        ? createProps(props)
        : createProps
      )
    }))
  }
}
