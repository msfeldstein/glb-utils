const fs = require('fs')
const path = require('path')
const commandLineArgs = require('command-line-args')
const GLBWriter = require('./glb-writer')
const opts = commandLineArgs([
  { name: 'src', type: String},
  { name: 'dst', type: String}
])

const src = opts.src
const dst = opts.dst
console.log(process.args)
console.log(`> Packaging ${src} into ${dst}`)

module.exports = function(src, dst) {
  const json = JSON.parse(fs.readFileSync(src).toString())
  // Buffer data by buffer name
  const bufferData = {}
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

  const glb = {
    json: json,
    content: JSON.stringify(json, null, 2),
    buffers: [mainBuffer]
  }

  GLBWriter(glb, dst)  
}
