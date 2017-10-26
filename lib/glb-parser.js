const fs = require('fs')
const constants = require('./glb-constants')
const GLB = require('./glb')

module.exports = function(path) {
  const buffer = fs.readFileSync(path)  
  const magic = buffer.toString('UTF-8', 0, 4)
  const version = buffer.readUInt32LE(constants.VERSION_OFFSET)
  const length = buffer.readUInt32LE(constants.LENGTH_OFFSET)
  const jsonLength = buffer.readUInt32LE(constants.CONTENT_LENGTH_OFFSET)

  const content = buffer.toString('UTF-8', constants.JSON_START, constants.JSON_START + jsonLength)
  
  const binaryChunkStart = constants.JSON_START + jsonLength
  const binaryDataLength = buffer.readUInt32LE(binaryChunkStart)
  const json = JSON.parse(content)
  const binary_glTF = buffer.slice(binaryChunkStart + 8)
  
  return new GLB(json, binary_glTF)
}