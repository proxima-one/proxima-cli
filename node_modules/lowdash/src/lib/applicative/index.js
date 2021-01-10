const Applicative = (function () {

  class Applicative {

    constructor(val) {
      this.val = val
    }

    map(fn) {
      return Applicative.of(fn(this.val))
    }

    // aka <*>
    // ap :: Applicative f => f (a -> b) -> f a -> f b
    ap(functor) {
      return Applicative.ap(this, functor)
    }
  }
  Object.defineProperty(Applicative, 'of', {
    value: function (val) {
      return new Applicative(val)
    },
    writable : false,
    enumerable : true,
    configurable : false
  })
  Object.defineProperty(Applicative, 'ap', {
    value: function (functor1, functor2) {
      return functor2.map(functor1.val)
    },
    writable : false,
    enumerable : true,
    configurable : false
  })
  return Applicative
})()

module.exports = Applicative
