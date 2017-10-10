const fs = require('fs')
const constants = require('./glb2-constants')

const bufferForFour = (n) => {
  return 4 - (n % 4)
}
/*

glb is {
  magic: String
  version: Number
  length: Full Length of file in bytes (opt)
  content: JSON as String
  json: JSON as Object
  buffers: array of node buffers
  binary_glTF: the main binary buffer
}
*/
module.exports = function(glb, outfile) {
  const json = glb.content
  const buffers = glb.buffers
  var fd =  fs.openSync(outfile, 'w');
  // Calculate layout
  const contentBuffer = new Buffer(json)
  const contentLength = contentBuffer.length
  // Keep binary offsets at multiples of 4
  const emptySpace = 4 - (contentLength % 4)
  let totalLength = constants.JSON_START + contentLength + emptySpace
  buffers.forEach((buffer) => {
    totalLength += 8 // Chunk header data
    totalLength += buffer.length + bufferForFour(buffer.length)
  })
  // const outputBuffer = Buffer.alloc(constants.JSON_START + contentLength + emptySpace)
  const outputBuffer = Buffer.alloc(totalLength)
  
  // Write Header
  let i = outputBuffer.write(constants.MAGIC, 0, 4)
  i = outputBuffer.writeUInt32LE(2, i, 4)
  i = outputBuffer.writeUInt32LE(totalLength, i, 4)
  // Write JSON
  i = outputBuffer.writeUInt32LE(contentBuffer.length + emptySpace, i, 4)
  i = outputBuffer.writeUInt32LE(constants.JSON_CHUNK_TYPE, i, 4)
  contentBuffer.copy(outputBuffer, i, 0)
  i += contentBuffer.length
  let bufferSpace = emptySpace
  while (bufferSpace > 0) {
    outputBuffer.write(" ", i, 1)
    i += 1
    bufferSpace--
  }

  // Write all buffers
  Object.keys(buffers).forEach((key) => {
    const buffer = buffers[key]
    const emptySpace = bufferForFour(buffer.length)
    i = outputBuffer.writeUInt32LE(buffer.length + emptySpace, i, 4)
    i = outputBuffer.writeUInt32LE(constants.BINARY_CHUNK_TYPE, i, 4)
    buffer.copy(outputBuffer, i, 0, buffer.length)
    i += buffer.length
    i += emptySpace
  })
  
  fs.writeSync(fd, outputBuffer)
  console.log(`Written to ${outfile}!`)
}