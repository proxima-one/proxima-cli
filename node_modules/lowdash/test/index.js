const {compose, curry, pipe, identity, trace, transduce} = require('../src')

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

console.log( match(/\s+/g)('hello world') )
//=> [ ' ' ]

const hasSpaces = match(/\s+/g)
// function(x) { return x.match(/\s+/g) }

console.log( hasSpaces('hello world') )
//=> [ ' ' ]

console.log( hasSpaces('spaceless') )
//=> null

console.log( filter(hasSpaces, ['the_spelling', 'te amo']) )
//=> ['te amo']

const findSpaces = filter(hasSpaces)
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

console.log( findSpaces(['the_spelling', 'te amo']) )
//=> ['te amo']

const noVowels = replace(/[aeiou]/ig)
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }

const censored = noVowels('*')
// function(x) { return x.replace(/[aeiou]/ig, '*') }

console.log( censored('Chocolate Cake') )
//=> 'Ch*c*l*t* C*k*'

// compose

const toUpperCase = function(x) { return x.toUpperCase() }
const exclaim = function(x) { return x + '!' }
const shout = compose(exclaim, toUpperCase)

console.log( shout('angry or hungry') )
//=> 'ANGRY OR HUNGRY!'

const reduce = curry(function(f, ary) {
  return ary.reduce(f)
})

const head = function(x) { return x[0] }
const reverse = reduce(function(acc, x) { return [x].concat(acc) })
const last = compose(head, reverse)

console.log( last(['jump', 'house', 'upper']) )
//=> 'upper'

const lastUpper = compose(toUpperCase, head, reverse)

console.log( lastUpper(['jump', 'house', 'upper']) )
//=> 'UPPER'

// pipe

const shoutPipe = pipe(exclaim, toUpperCase)

console.log( shoutPipe('angry or hungry') )
//=> 'ANGRY OR HUNGRY!'

// pointfree

const toLowerCase = function(x) { return x.toLowerCase() }
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase)

console.log( snakeCase('Snake Case') )
//=> 'snake_case'

const split = curry(function(separator, str) {
  return str.split(separator)
})
const join = curry(function(separator, ary) {
  return ary.join(separator)
})
const initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '))

console.log( initials('json jackson jason') )
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

console.log( dasherize('The world is a  vampire') )
//=> after split [ 'The', 'world', 'is', 'a', 'vampire' ]
//=> 'the-world-is-a-vampire'
