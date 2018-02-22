const fs = require('fs')
const path = require('path')
const GLB = require('../lib/glb')
const GLBWriter = require('../lib/glb-writer')
const readline = require('readline')

const opts = require('command-line-args')([
  { name: 'src', type: String, required: true},
  { name: 'dst', type: String, required: true},
  { name: 'tex', type: String, required: true}
])

const src = opts.src
const dst = opts.dst
const tex = opts.tex
console.log(process.args)
console.log(`>> Packaging ${src} into ${dst}`)

const vertices = []
const uvs = []
const indices = []

var lineReader = require('readline').createInterface({
  input: fs.createReadStream(src)
})

const pushFloats = function(arr, elements) {
  elements.forEach((el) => {
    arr.push(parseFloat(el))
  })
}

const pushFaces = function(arr, elements) {
  elements.forEach((el) => {
    const index = el.split('/')[0] - 1 // Index in obj indexes from 1 like a total goof
    arr.push(parseInt(index))
  })
}

lineReader.on('line', (line) => {
  const parts = line.split(' ')
  switch (parts[0]) {
    case 'v':
      pushFloats(vertices, parts.slice(1))
      break
    case 'vt':
      pushFloats(uvs, parts.slice(1))
      break
    case 'f':
      pushFaces(indices, parts.slice(1))
  }
})

lineReader.on('close', () => {
  // const vertexArray = new Float32Array(vertices)
  // const uvArray = new Float32Array(uvs)
  // const indexArray = new Uint32Array(indices)
  
  const json = {
    asset: {
      version: "2.0"
    },
    accessors: [],
    buffers: [],
    bufferViews: [],
    camera: [],
    images: [],
    nodes: [
      {
        name: "Mesh",
        mesh: 0
      }
    ],
    scene: 0,
    scenes: [{
      name: "MainScene",
      nodes: [0]
    }],
    materials: [{
      name: "default",
      pbrMetallicRoughness: {
        baseColorTexture: {
          index: 0
        }
      }
    }],
    textures: [],
    meshes: [
      {
        primitives: [
          {
            attributes: {
              POSITION: 0,
              TEXCOORD_0: 1
            },
            indices: 2,
            material: 0,
            mode: 4
          }
        ]        
      }
    ]
  }
  
  
  let buffer = Buffer.alloc(0)
  
  const addBufferData = (bufferData, accessor, isIndex) => {
    const bufferLength = bufferData.byteLength
    const padLength =  (4 - bufferData.byteLength % 4) % 4
    const bufferView = {
      buffer: 0,
      byteOffset: buffer.byteLength,
      byteLength: bufferLength + padLength,
      target: isIndex ? 34963 : 34962
    }
    json.bufferViews.push(bufferView)
    const bufferViewIndex = json.bufferViews.length - 1
    if (accessor) {
      accessor.bufferView = bufferViewIndex
      accessor.byteOffset = 0 
      json.accessors.push(accessor)  
    }
    buffer = Buffer.concat([buffer, bufferData, Buffer.alloc(padLength)])
    return bufferViewIndex
  }
  
  const addTexture = (bufferData) => {
    const index = addBufferData(bufferData)
    json.images.push({
      mimeType: "image/jpg",
      bufferView: index
    })
    json.textures.push({
      source: json.images.length - 1
    })
  }
  
  const vertexBuffer = Buffer.from(new Float32Array(vertices).buffer)
  addBufferData(vertexBuffer, {
    name: "Vertices",
    componentType: 5126, // Float
    type: "VEC3",
    count: vertices.length / 3
  })
  
  const uvBuffer = Buffer.from(new Float32Array(uvs).buffer)
  addBufferData(uvBuffer, {
    name: "UVs",
    componentType: 5126, // Float
    type: "VEC2",
    count: uvs.length / 2
  })
  
  const indicesBuffer = Buffer.from(new Uint32Array(indices).buffer)
  addBufferData(indicesBuffer, {
    name: "Indices",
    componentType: 5125, // Unsigned int
    type: "SCALAR",
    count: indices.length
  }, true)
  console.log("Indices: ", indices.length)

  addTexture(fs.readFileSync(tex))
  
  json.buffers.push({
    byteLength: buffer.byteLength
  })
  console.log(json)


  
  GLBWriter(new GLB(json, buffer), dst)
})