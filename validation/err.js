module.exports = function err(name, message) {
  throw `${name}: ${message}`
}