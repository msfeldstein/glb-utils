const {decodeUTF8} = require('./decodeUTF8')

module.exports = function() {
  console.log("\n\n// Shaders\n")
  const json = this.json
  Object.keys(json.shaders).forEach((s) => {
    const shaderInfo = json.shaders[s]
    if (shaderInfo.extensions) {
      const bufferView = json.bufferViews[shaderInfo.extensions.KHR_binary_glTF.bufferView]
      const buffer = this.buffers[bufferView.buffer]
      const source = decodeUTF8(buffer, bufferView.byteOffset, bufferView.byteLength)
      console.log(`*** ${s} *** \n\n`, source)
    }
  })





}