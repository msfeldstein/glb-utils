const fs = require('fs')
const constants = require('./glb-constants')

const bufferForFour = (n) => {
  return (4 - (n % 4)) % 4
}

module.exports = function(glb, outfile) {
  const json = JSON.stringify(glb.json)
  const buffer = glb.buffer
  
  var fd =  fs.openSync(outfile, 'w');
  // Calculate layout
  const contentBuffer = new Buffer(json)
  const contentLength = contentBuffer.length
  // Keep binary offsets at multiples of 4
  const emptySpace = bufferForFour(contentLength)
  let totalLength = constants.JSON_START + contentLength + emptySpace
  totalLength += 8 // Chunk header data
  totalLength += buffer.length + bufferForFour(buffer.length)
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

  const binaryEmptySpace = bufferForFour(buffer.length)
  i = outputBuffer.writeUInt32LE(buffer.length + binaryEmptySpace, i, 4)
  i = outputBuffer.writeUInt32LE(constants.BINARY_CHUNK_TYPE, i, 4)
  buffer.copy(outputBuffer, i, 0, buffer.length)

  fs.writeSync(fd, outputBuffer, 0, outputBuffer.length)
  console.log(`Written to ${outfile}!`)
}