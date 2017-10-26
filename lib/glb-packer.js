/*
 * Packs a raw gltf file with .bin buffers and .png textures into a packed glb binary
 */

const fs = require('fs')
const path = require('path')
const GLB = require('./glb')

/*
 * Reads a GLTF file into a GLB data model
 * This will pack all the binary assets into one buffer
 */
module.exports = function(src) {
  const json = JSON.parse(fs.readFileSync(src).toString())

  const workingPath = path.dirname(src)
  let bufferIndex = 0

  const uriToBuffer = (uri) => {
    const abs = path.join(workingPath, uri)
    return fs.readFileSync(abs)
  }

  const mainBufferDef = json.buffers[0]
  let mainBuffer = uriToBuffer(mainBufferDef.uri)
  delete mainBufferDef.uri

  // Convert all images into main buffer
  // todo reuse bufferviews for same image uri
  const bufferViews = json.bufferViews
  json.images.forEach((imageDef) => {
    if (imageDef.uri) {
      const imageType = path.extname(imageDef.uri).slice(1)
      const mimeType = `image/${imageType}`
      imageDef.mimeType = imageDef.mimeType || mimeType
      const imageBuffer = uriToBuffer(imageDef.uri)
      
      const offset = mainBuffer.length
      const length = imageBuffer.length   
      const padBytes = 4 - (length % 4)
      const padBuffer = Buffer.alloc(padBytes) 
      mainBuffer = Buffer.concat([mainBuffer, imageBuffer, padBuffer])
      
      const bufferView = {
        buffer: 0,
        byteLength: length,
        byteOffset: offset
      }
      bufferViews.push(bufferView)
      const bufferViewIndex = json.bufferViews.length - 1
      delete imageDef.uri
      imageDef.bufferView = bufferViewIndex
      imageDef.mimeType = "image/png"
    }
  })

  mainBufferDef.byteLength = mainBuffer.length
  
  return new GLB(json, mainBuffer)
}
