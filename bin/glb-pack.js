#!/usr/bin/env node

const GLBPacker = require('../lib/glb-packer')

const src = process.argv[2]
const output = src.replace(".gltf", ".glb")
console.log(`>> Converting ${src} to ${output}`)

GLBPacker(src, output)