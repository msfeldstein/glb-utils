const Ajv = require('ajv');

const nodeSchema = require('./schemas/node')

const schema = {
  required: ["nodes"],
  properties: {
    nodes: nodeSchema
  }
}

module.exports = function(json) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema)
  const valid = validate(json)
  console.log("Schema valid", valid, validate.errors)
}