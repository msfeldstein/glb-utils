const fs = require('fs')
const constants = require('./glb-constants')

module.exports = function(path) {
  const buffer = fs.readFileSync(path)  
  const magic = buffer.toString('UTF-8', 0, 4)
  const version = buffer.readUInt32LE(constants.VERSION_OFFSET)
  const length = buffer.readUInt32LE(constants.LENGTH_OFFSET)
  const jsonLength = buffer.readUInt32LE(constants.CONTENT_LENGTH_OFFSET)
  console.log("Magic ", magic)
  console.log("Version ", version)
  console.log("Length", length)

  const content = buffer.toString('UTF-8', constants.JSON_START, constants.JSON_START + jsonLength)
  
  const binaryChunkStart = constants.JSON_START + jsonLength
  const binaryDataLength = buffer.readUInt32LE(binaryChunkStart)
  console.log("Binary Len: " , binaryDataLength)
  const json = JSON.parse(content)
  const binary_glTF = buffer.slice(binaryChunkStart + 8)
  const buffers = [
    binary_glTF
  ]
  
  return {
    magic,
    version,
    length,
    content,
    json,
    buffers,
    binary_glTF
  }
}