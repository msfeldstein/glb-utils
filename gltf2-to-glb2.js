const fs = require('fs')
const path = require('path')
const commandLineArgs = require('command-line-args')
const GLBWriter = require('./glb2-writer')
const opts = commandLineArgs([
  { name: 'src', type: String},
  { name: 'dst', type: String}
])

const src = opts.src
const dst = opts.dst

const json = JSON.parse(fs.readFileSync(src).toString())
console.log(json)
// Buffer data by buffer name
const bufferData = {}
const workingPath = path.dirname(src)
console.log(workingPath)
let bufferIndex = 0
Object.keys(json.buffers).forEach((bufferName) => {
  const bufferDef = json.buffers[bufferName]
  console.log(bufferDef)
  bufferData[bufferName] = fs.readFileSync(path.join(workingPath, bufferDef.uri))
  delete bufferDef.uri
  bufferDef.buffer = bufferIndex
  bufferIndex++
})

GLBWriter(JSON.stringify(json), bufferData, dst)
