module.exports = function () {
  const meshes = this.json.meshes
  Object.keys(meshes).forEach((key) => {
    meshes[key].primitives.forEach((primitive) => {
      const accessor = primitive.attributes.POSITION
      console.log(accessor)
    })
    
  })
}