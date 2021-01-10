module.exports = function (xf, f, init, arr) {
  return xf(arr).reduce(f, init)
}
