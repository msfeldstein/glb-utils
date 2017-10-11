const fs = require('fs')
const path = require('path')
const GLBWriter = require('../glb2-writer')
const readline = require('readline')
const DracoEncode = require('draco3d').createEncoderModule({})
console.log(DracoEncode)

const opts = require('command-line-args')([
  { name: 'src', type: String, required: true},
  { name: 'dst', type: String, required: true},
])

const src = opts.src
const dst = opts.dst

console.log(`>> Packaging ${src} into ${dst}`)