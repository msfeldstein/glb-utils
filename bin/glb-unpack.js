#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const GLBParser = require('../lib/glb-parser')

const src = process.argv[2]
console.log(`>> Unpacking ${src}`)

const glb = GLBParser(src)

const bufferPath = src.replace('.glb', '.bin')
glb.json.buffers[0].uri = path.basename(bufferPath)

const gltfName = src.replace('.glb', '.gltf')
fs.writeFileSync(gltfName, JSON.stringify(glb.json, null, 2))
console.log("Written", gltfName)

fs.writeFileSync(bufferPath, glb.buffer)
console.log("Written", bufferPath)

let nextNameIndex = 0
if (glb.json.images) {
  glb.json.images.forEach(function(image) {
    const imageOut = path.join(path.dirname(src), image.name ? image.name : `${nextNameIndex++}.${image.mimeType ? image.mimeType.split('/')[1] : 'png'}`)
    const bufferView = glb.json.bufferViews[image.bufferView]
    const buffer = glb.buffers[bufferView.buffer]
    const imageData = Buffer.alloc(bufferView.byteLength)
    buffer.copy(imageData, 0, bufferView.byteOffset, bufferView.byteOffset + bufferView.byteLength)
    fs.writeFileSync(imageOut, imageData)
    console.log("Written ", imageOut)
  })  
}
