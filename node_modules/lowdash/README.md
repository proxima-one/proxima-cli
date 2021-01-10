# lowdash
lowdash is a functional JavaScript library including **compose**, **pipe**, **curry**, **transduce**, **identity**, **trace**, **Functor**, **Monad**, **Applicative**

## Examples
```js
const {compose, curry, pipe, identity, trace, transduce, Functor, Monad, Applicative} = require('lowdash')

// curry

const match = curry(function(what, str) {
  return str.match(what)
})

const replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement)
})

const filter = curry(function(f, ary) {
  return ary.filter(f)
})

const map = curry(function(f, ary) {
  return ary.map(f)
})

match(/\s+/g)('hello world')
//=> [ ' ' ]

const hasSpaces = match(/\s+/g)
// function(x) { return x.match(/\s+/g) }

hasSpaces('hello world')
//=> [ ' ' ]

hasSpaces('spaceless')
//=> null

filter(hasSpaces, ['the_spelling', 'te amo'])
//=> ['te amo']

const findSpaces = filter(hasSpaces)
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

findSpaces(['the_spelling', 'te amo'])
//=> ['te amo']

const noVowels = replace(/[aeiou]/ig)
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }

const censored = noVowels('*')
// function(x) { return x.replace(/[aeiou]/ig, '*') }

censored('Chocolate Cake')
//=> 'Ch*c*l*t* C*k*'

// compose

const toUpperCase = function(x) { return x.toUpperCase() }
const exclaim = function(x) { return x + '!' }
const shout = compose(exclaim, toUpperCase)

shout('angry or hungry')
//=> 'ANGRY OR HUNGRY!'

const reduce = curry(function(f, ary) {
  return ary.reduce(f)
})

const head = function(x) { return x[0] }
const reverse = reduce(function(acc, x) { return [x].concat(acc) })
const last = compose(head, reverse)

last(['jump', 'house', 'upper'])
//=> 'upper'

const lastUpper = compose(toUpperCase, head, reverse)

lastUpper(['jump', 'house', 'upper'])
//=> 'UPPER'

// pipe

const shoutPipe = pipe(exclaim, toUpperCase)

console.log( shoutPipe('angry or hungry') )
//=> 'ANGRY OR HUNGRY!'

// pointfree

const toLowerCase = function(x) { return x.toLowerCase() }
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase)

snakeCase('Snake Case')
//=> 'snake_case'

const split = curry(function(separator, str) {
  return str.split(separator)
})
const join = curry(function(separator, ary) {
  return ary.join(separator)
})
const initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '))

initials('json jackson jason')
//=> 'J. J. J'

// transduce =  transform + reduce

const t = curry(transduce)(
  compose(map(x => x +1), filter(x => x > 2)),
  (result, x) => result.concat(x),
  []
)
console.log(t([1,2,3,4]))
//=> [4, 5]

// debug

const dasherize = compose(join('-'), map(toLowerCase), trace('after split'),
  split(' '), replace(/\s{2,}/ig, ' '))

dasherize('The world is a  vampire')
//=> after split [ 'The', 'world', 'is', 'a', 'vampire' ]
//=> 'the-world-is-a-vampire'

// Functor, Monad, Applicative

const increment = x => x + 1
const add2 = compose(increment, increment)
const add4 = compose(add2, add2)

console.log(
  Functor.of(1)
    .map(increment)
    .map(add4)
)

const incrementMonad = compose(Monad.of, increment)
const add2Monad = x => Monad.of(x).bind(incrementMonad).bind(incrementMonad)
const add4Monad = x => Monad.of(x).bind(add2Monad).bind(add2Monad)

console.log(
  Monad.of(1)
    .bind(incrementMonad)
    .bind(add4Monad)
    .join()
)

const add = a => b => a + b
const add2 = add(2)

let left = Applicative.of(add2).ap(Applicative.of(3))
let right = Applicative.of(3).map(add2)

console.log(
  left.val === right.val // 5
)

```

## Installation

```
npm install --save lowdash
```

## Usage
You can import from `lowdash`:

```js
import {compose, curry, pipe, identity, trace, transduce, Functor, Monad, Applicative} from 'lowdash';
// or
const {compose, curry, pipe, identity, trace, transduce, Functor, Monad, Applicative} = require('lowdash');
```
