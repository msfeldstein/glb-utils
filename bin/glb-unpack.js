#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const GLBParser = require('../glb2-parser')

const src = process.argv[2]
const output = src.replace(".gltf", ".glb")
console.log(`>> Unpacking ${src}`)

const glb = GLBParser(src)

const gltfName = src.replace('.glb', '.gltf')
fs.writeFileSync(gltfName, JSON.stringify(glb.json, null, 2))
console.log("Written", gltfName)

const bufferOut = src.replace('.glb', '.bin')
fs.writeFileSync(bufferOut, glb.buffers[0])
console.log("Written", bufferOut)

glb.json.images.forEach(function(image) {
  const imageOut = path.join(path.dirname(src), image.name)
  const bufferView = glb.json.bufferViews[image.bufferView]
  const buffer = glb.buffers[bufferView.buffer]
  const imageData = Buffer.from(buffer, bufferView.byteOffset, bufferView.byteLength)
  fs.writeFileSync(imageOut, imageData)
  console.log("Written", imageOut)
})