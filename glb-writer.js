const fs = require('fs')
const constants = require('./glb-constants')

module.exports = function(glb, outfile) {
  var fd =  fs.openSync(outfile, 'w');
  const contentBuffer = new Buffer(glb.content)
  const contentLength = contentBuffer.length
  // Keep binary offsets at multiples of 4
  const emptySpace = 4 - (contentLength % 4)
  const binary_glTF = glb.binary_glTF
  const totalLength = 20 + contentLength + emptySpace + binary_glTF.length
  const buffer = Buffer.alloc(totalLength)
  
  buffer.write(constants.MAGIC, 0, 4)
  buffer.writeUInt32LE(glb.version, constants.VERSION_OFFSET, 4)
  buffer.writeUInt32LE(totalLength, constants.LENGTH_OFFSET, 4)
  buffer.writeUInt32LE(contentLength, constants.CONTENT_LENGTH_OFFSET, 4)
  buffer.writeUInt32LE(glb.contentFormat, constants.CONTENT_FORMAT_OFFSET, 4)
  contentBuffer.copy(buffer, constants.CONTENT_OFFSET, 0, contentLength)

  var binaryOffset = constants.CONTENT_OFFSET + contentLength + emptySpace
  binary_glTF.copy(buffer, binaryOffset, 0, binary_glTF.length)
  fs.writeSync(fd, buffer)
  console.log(`Written to ${outfile}!`)
}