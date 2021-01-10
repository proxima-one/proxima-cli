const Monad = (function () {

  class Monad {

    constructor(val) {
      this.val = val
    }

    map(fn) {
      return Monad.map(this, fn)
    }
    
    // aka fold
    // join :: Monad m => m a -> a
    join() {
      return Monad.join(this)
    }

    // aka chain, flatMap, then, >>=
    // bind :: Monad m => m a -> (a -> m b) -> m b
    bind(fn) {
      return Monad.bind(this, fn)
    }
  }
  Object.defineProperty(Monad, 'of', {
    value: function (val) {
      return new Monad(val)
    },
    writable : false,
    enumerable : true,
    configurable : false
  })
  Object.defineProperty(Monad, 'map', {
    value: function (monad, fn) {
      return Monad.of(fn(monad.val))
    },
    writable : false,
    enumerable : true,
    configurable : false
  })
  Object.defineProperty(Monad, 'join', {
    value: function (monad) {
      return monad.val
    },
    writable : false,
    enumerable : true,
    configurable : false
  })
  Object.defineProperty(Monad, 'bind', {
    value: function (monad, fn) {
      return monad.map(fn).join()
    },
    writable : false,
    enumerable : true,
    configurable : false
  })
  return Monad
})()

module.exports = Monad
