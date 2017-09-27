const err = require('./err')

module.exports = function validateNode(name, node, glb) {
  // validate all children are readFileSync
  
  // validate matrices are legal
  if (node.matrix && node.matrix.length != 16) {
    err(name, "Invalid Matrix")
  }
  
  if (node.translation && node.translation.length != 3) {
    err("Invalid translation", name)
  }
  
  if (node.scale && node.scale.length != 3) {
    err("Invalid scale", name)
  }
  
  if (node.rotation && node.rotation.length != 4) {
    err("Invalid rotation", name)
  }
  
  
}