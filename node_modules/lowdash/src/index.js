const compose = require('./lib/compose')
const curry = require('./lib/curry')
const identity = require('./lib/identity')
const trace = require('./lib/trace')
const transduce = require('./lib/transduce')
const pipe = require('./lib/pipe')
const cast = require('./lib/cast')
const permute = require('./lib/permute')
const mapProps = require('./lib/mapProps')
const withProps = require('./lib/withProps')

const Functor = require('./lib/functor')
const Monad = require('./lib/monad')
const Applicative = require('./lib/applicative')

module.exports = {
  compose,
  curry,
  pipe,
  identity,
  trace,
  transduce,
  cast,
  permute,
  mapProps,
  withProps,
  Functor,
  Monad,
  Applicative
}
