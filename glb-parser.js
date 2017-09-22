const fs = require('fs')
const constants = require('./glb-constants')

module.exports = function(path) {
  const buffer = fs.readFileSync(path)  
  const magic = buffer.toString('UTF-8', 0, 4)
  const version = buffer.readUInt32LE(constants.VERSION_OFFSET)
  const length = buffer.readUInt32LE(constants.LENGTH_OFFSET)
  const contentLength = buffer.readUInt32LE(constants.CONTENT_LENGTH_OFFSET)
  const contentFormat = buffer.readUInt32LE(constants.CONTENT_FORMAT_OFFSET)
  console.log("Magic ", magic)
  console.log("Version ", version)
  console.log("Length", length)
  console.log("Content Length", contentLength)
  console.log("Content Format", contentFormat)

  const content = buffer.toString('UTF-8', constants.CONTENT_OFFSET, constants.CONTENT_OFFSET + contentLength)
  const json = JSON.parse(content)
  const binary_glTF = buffer.slice(constants.CONTENT_OFFSET + contentLength)
  const buffers = {
    binary_glTF
  }
  
  return {
    magic,
    version,
    length,
    contentLength,
    contentFormat,
    content,
    json,
    buffers,
    binary_glTF
  }
}