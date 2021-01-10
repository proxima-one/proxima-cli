const Functor = (function () {

  class Functor {

    constructor(val) {
      this.val = val
    }

    map(fn) {
      return Functor.map(this, fn)
    }
  }
  Object.defineProperty(Functor, 'of', {
    value: function (val) {
      return new Functor(val)
    },
    writable : false,
    enumerable : true,
    configurable : false
  })
  Object.defineProperty(Functor, 'map', {
    value: function (functor, fn) {
      return Functor.of(fn(functor.val))
    },
    writable : false,
    enumerable : true,
    configurable : false
  })
  return Functor
})()

module.exports = Functor
