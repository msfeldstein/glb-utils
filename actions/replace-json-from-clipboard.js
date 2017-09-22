const ncp = require("copy-paste");

module.exports = function() {
  const glb = this
  const newJSON = ncp.paste()
  const json = JSON.parse(newJSON)
  glb.content = JSON.stringify(json)
  glb.contentLength = glb.content.length
  glb.json = json
  console.log("JSON and Content updated")
}