const fs = require('fs')

const VERSION_OFFSET = 4
const LENGTH_OFFSET = 8
const CONTENT_OFFSET = 12
const CONTENT_LENGTH_OFFSET = 12
const MAGIC = 'glTF'
const JSON_START = 20
const JSON_CHUNK_TYPE = 0x4E4F534A
const BINARY_CHUNK_TYPE = 0x004E4942

const ComponentTypes = {
  BYTE: 5120,
  UNSIGNED_BYTE: 5121,
  SHORT: 5122,
  UNSIGNED_SHORT: 5123,
  UNSIGNED_INT: 5125,
  FLOAT: 5126
}

function componentTypeToByteSize(componentType) {
  return {
    [ComponentTypes.BYTE]: 1,
    [ComponentTypes.UNSIGNED_BYTE]: 1,
    [ComponentTypes.SHORT]: 2,
    [ComponentTypes.UNSIGNED_SHORT]: 2,
    [ComponentTypes.UNSIGNED_INT]: 4,
    [ComponentTypes.FLOAT]: 4
  }[componentType]
}

function typeToItemCount(type) {
  return {
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT3: 9,
    MAT4: 16
  }[type]
}

class GLB {
  json() {
    return this._json
  }
  
  buffer() {
    return this._buffer
  }
  
  addBufferData(buffer) {
    let bufferSize = buffer.byteLength
    let padLength = (4 - (bufferSize % 4)) % 4
    const byteOffset = this._buffer.byteLength
    this._buffer = Buffer.concat([this._buffer, buffer, Buffer.alloc(padLength)])
    const bufferView = {
      buffer: 0,
      byteOffset: byteOffset,
      byteLength: bufferSize
    }
    this.json().bufferViews.push(bufferView)
    return this.json().bufferViews.length - 1
  }
  
  accessorDataByIndex(index) {
    return this.accessorData(this.json().accessors[index])
  }
  
  accessorData(accessor) {
    const bufferView = this.json().bufferViews[accessor.bufferView]
    const mainBuffer = this.buffer()
    const newBuffer = Buffer.alloc(bufferView.byteLength)
    let writeIndex = 0
    let readIndex = bufferView.byteOffset
    
    const chunkSize =
      componentTypeToByteSize(accessor.componentType) *
      typeToItemCount(accessor.type)
      
    const stride = bufferView.byteStride || chunkSize
    for (var item = 0; item < accessor.count; item++) {
      const bytesCopied = mainBuffer.copy(newBuffer, writeIndex, readIndex, readIndex + chunkSize)
      readIndex += stride
      writeIndex += bytesCopied
    }
    return newBuffer
  }
  
  version() {
    return 2
  }
}

const GLBParse = function(absolutePath) {
  const buffer = fs.readFileSync(absolutePath)  
  const magic = buffer.toString('UTF-8', 0, 4)
  const version = buffer.readUInt32LE(VERSION_OFFSET)
  const length = buffer.readUInt32LE(LENGTH_OFFSET)
  const jsonLength = buffer.readUInt32LE(CONTENT_LENGTH_OFFSET)

  const content = buffer.toString('UTF-8', JSON_START, JSON_START + jsonLength)
  
  const binaryChunkStart = JSON_START + jsonLength
  const binaryDataLength = buffer.readUInt32LE(binaryChunkStart)
  const json = JSON.parse(content)
  const binary_glTF = buffer.slice(binaryChunkStart + 8)
  
  const glb = new GLB()
  glb._json = json
  glb._buffer = binary_glTF
  return glb
}


const bufferForFour = (n) => {
  return 4 - (n % 4)
}

const GLBWrite = function(glb, outfile) {
  const json = JSON.stringify(glb.json())
  var fd =  fs.openSync(outfile, 'w');
  // Calculate layout
  const contentBuffer = new Buffer(json)
  const contentLength = contentBuffer.length
  // Keep binary offsets at multiples of 4
  const jsonPadding = 4 - (contentLength % 4)
  let totalLength = JSON_START + contentLength + jsonPadding
  const buffer = glb.buffer()
  totalLength += 8 // Chunk header data
  totalLength += buffer.length + bufferForFour(buffer.length)

  // const outputBuffer = Buffer.alloc(JSON_START + contentLength + jsonPadding)
  const outputBuffer = Buffer.alloc(totalLength)
  
  // Write Header
  let i = outputBuffer.write(MAGIC, 0, 4)
  i = outputBuffer.writeUInt32LE(2, i, 4)
  i = outputBuffer.writeUInt32LE(totalLength, i, 4)
  // Write JSON
  i = outputBuffer.writeUInt32LE(contentBuffer.length + jsonPadding, i, 4)
  i = outputBuffer.writeUInt32LE(JSON_CHUNK_TYPE, i, 4)
  contentBuffer.copy(outputBuffer, i, 0)
  i += contentBuffer.length
  let emptySpace = jsonPadding
  while (emptySpace > 0) {
    outputBuffer.write(" ", i, 1)
    i += 1
    emptySpace--
  }

  // Write all buffers
  const bufferPadding = bufferForFour(buffer.length)
  i = outputBuffer.writeUInt32LE(buffer.length + bufferPadding, i, 4)
  i = outputBuffer.writeUInt32LE(BINARY_CHUNK_TYPE, i, 4)
  buffer.copy(outputBuffer, i, 0, buffer.length)
  
  fs.writeSync(fd, outputBuffer)
  console.log(`Written to ${outfile}!`)
}

module.exports = {
  GLB,
  GLBParse,
  GLBWrite
}