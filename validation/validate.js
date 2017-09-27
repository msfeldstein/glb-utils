const validateNode = require('./nodes')
const validateSchema = require('./schema')
module.exports = function(glb) {
  validateSchema(glb.json)
  const nodes = glb.json.nodes
  if (!nodes) {
    throw "No Nodes"
  }
  Object.keys(nodes).forEach(function(name) {
    validateNode(name, nodes[name], glb)
  })

  // Ensure all accessors exist
  
  // Ensure the content and binary lengths aren't invalid
  
  // ensure all matrices have the correct lengths (16)
}