module.exports = {
  type: "object",
  patternProperties: {
    ".+": {
      type: "object",
      properties: {
        name: {type: "string"},
        children: {
          type: "array",
          items: {type: "string"}
        },
        matrix: {
          type: "array",
          maxItems: 16,
          minItems: 16
        },
        translation: {
          type: "array",
          maxItems: 3,
          minItems: 3
        },
        scale: {
          type: "array",
          maxItems: 3,
          minItems: 3
        },
        rotation: {
          maxItems: 4,
          minItems: 4
        }
      }
    }
  }
}
