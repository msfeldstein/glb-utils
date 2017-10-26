const GLBParser = require('../lib/glb-parser')
const GLBPacker = require('../lib/glb-packer')

var assert = require('assert');
const fs = require('fs')
const path = require('path')

describe('GLBPacker', function() {
  describe('pack', function() {
    // Ensure that all the image buffer views match an image file's data
    it('Should pack images correctly', function() {
      const gltfPath = './test/assets/BarramundiFish/glTF/BarramundiFish.gltf'
      const gltf = JSON.parse(fs.readFileSync(gltfPath))
      const allFileImages = gltf.images.map((i) => fs.readFileSync(path.join(path.dirname(gltfPath), i.uri)))
      const glb = GLBPacker(gltfPath)
      glb.json.images.forEach((image) => {
        const bufferImageData = glb.bufferViewData(image.bufferView)
        let match = false
        // We shoudn't expect them to match by index
        allFileImages.forEach((image) => {
          if (bufferImageData.compare(image) === 0) match = true
        })
        assert.ok(match)
      })
    });
  });
});