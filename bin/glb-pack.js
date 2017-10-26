#!/usr/bin/env node

const GLBPacker = require('../lib/glb-packer')
const GLBWriter = require('../lib/glb-writer')

const src = process.argv[2]
const output = src.replace(".gltf", ".glb")
console.log(`>> Converting ${src} to ${output}`)

const glb = GLBPacker(src)
GLBWriter(glb, output)