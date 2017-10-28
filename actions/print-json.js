module.exports = function (key) {
  console.log("KEY", key)
  const output = key ? this.json[key] : this.json
  console.log(JSON.stringify(output, 0, 2))
}