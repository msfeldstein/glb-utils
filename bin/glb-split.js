#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const GLBParser = require('../lib/glb-parser')

const src = process.argv[2]
console.log(`>> Unpacking ${src}`)

const glb = GLBParser(src)
const buffer = glb.buffer
console.log(buffer)
const bufferViewsWithData = glb.json.bufferViews.map(function(bufferView) {
  const data = Buffer.alloc(bufferView.byteLength)
  buffer.copy(data, 0, bufferView.byteOffset, bufferView.byteOffset + bufferView.byteLength)
  return {
    bufferView,
    data
  }
})
console.log(glb.json.meshes)


