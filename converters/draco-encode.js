const fs = require('fs')
const path = require('path')
const {GLB, GLBParse, GLBWrite} = require('../lib/glb')
const GLBWriter = require('../lib/glb-writer')
const readline = require('readline')
const encoderModule = require('draco3d').createEncoderModule({})

const opts = require('command-line-args')([
  { name: 'src', type: String, required: true},
  { name: 'dst', type: String, required: true},
])

const src = opts.src
const dst = opts.dst

console.log(`>> Packaging ${src} into ${dst}`)

const model = GLBParse(src)

const encoder = new encoderModule.Encoder();
const meshBuilder = new encoderModule.MeshBuilder();


model.json().meshes.forEach((mesh) => {
  mesh.primitives.forEach((primitive) => {
    var dracoMesh = new encoderModule.Mesh();
    const dracoTypeMap = {}
    const indicesAccessor = model.json().accessors[primitive.indices]
    const indices = model.accessorData(indicesAccessor)
    meshBuilder.AddFacesToMesh(dracoMesh, indicesAccessor.count / 3, indices)
    
    const positionAccessor = model.json().accessors[primitive.attributes.POSITION]
    const positions = model.accessorData(positionAccessor)
    const numPoints = positionAccessor.count
    
    const dv = new DataView(positions.buffer)
    console.log(dv.getFloat32(124))
    
    dracoTypeMap[encoderModule.POSITION] =
      meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.POSITION, numPoints, 3, positions)
    delete primitive.attributes.POSITION
    
    if (primitive.attributes.NORMAL !== undefined) {
      const normals = model.accessorDataByIndex(primitive.attributes.NORMAL)
      dracoTypeMap[encoderModule.NORMAL] =
        meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.NORMAL, numPoints, 3, normals)
      delete primitive.attributes.NORMAL
    }
    if (primitive.attributes.TEXCOORD_0 !== undefined) {
      const texIndexes = model.accessorDataByIndex(primitive.attributes.TEXCOORD_0)
      dracoTypeMap[encoderModule.TEX_COORD] =
        meshBuilder.AddFloatAttributeToMesh(dracoMesh, encoderModule.TEX_COORD, numPoints, 2, texIndexes)
      delete primitive.attributes.TEXCOORD_0
    }

    const encodedData = new encoderModule.DracoInt8Array()
    encoder.SetEncodingMethod(encoderModule.MESH_EDGEBREAKER_ENCODING)
    const encodedLength = encoder.EncodeMeshToDracoBuffer(dracoMesh, encodedData)
    const outputBuffer = new ArrayBuffer(encodedLength)
    console.log("Encoded Length", encodedLength)
    const outputData = new Int8Array(outputBuffer)
    for (var i = 0; i < encodedLength; i++) {
      outputData[i] = encodedData.GetValue(i)
    }
    require('fs').writeFileSync('/Users/feldstein/Desktop/models/draco/bunny.drc', Buffer.from(outputBuffer))
    const bufferViewIndex = model.addBufferData(Buffer.from(outputBuffer))
    primitive.extensions = primitive.extensions || {}
    primitive.extensions.KHR_DRACO_MESH_COMPRESSION = {
      bufferView: bufferViewIndex,
      attributes: dracoTypeMap
    }
  })
  GLBWrite(model, dst)
})

