const validate = require('./validate')
const GLBParser = require('../glb-parser')
const infile = process.argv[2]
const glb = GLBParser(infile)
console.log("Validating", infile)

validate(glb)