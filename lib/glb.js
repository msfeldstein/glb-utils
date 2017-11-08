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
  constructor(json, buffer) {
    this._json = json
    this._buffer = buffer
  }
  
  get json() {
    return this._json
  }
  
  get buffer() {
    return this._buffer
  }
  
  get buffers() {
    return [this._buffer]
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
  
  accessorData(accessor) {
    if (typeof accessor === "number") {
      accessor = this.json.accessors[index]
    }
    const bufferView = this.json.bufferViews[accessor.bufferView]
    const mainBuffer = this.buffer
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
  
  bufferViewData(bufferView) {
    if (typeof bufferView === "number") {
      bufferView = this.json.bufferViews[bufferView]
    }
    return this.buffer.slice(bufferView.byteOffset, bufferView.byteOffset + bufferView.byteLength)
  }
  
  version() {
    return 2
  }
}

module.exports = GLB