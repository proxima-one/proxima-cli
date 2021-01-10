module.exports = function (fn, arity) {
  const totalArity = Number.isInteger(arity) ? arity : fn.length
  const slice = Array.prototype.slice

  return function recur () {
    const args = slice.call(arguments)
    if (args.length >= totalArity) {
      return fn.apply(fn, args)
    } else {
      return function () {
        const moreArgs = slice.call(arguments)
        return recur.apply(null, args.concat(moreArgs))
      }
    }
  }
}
