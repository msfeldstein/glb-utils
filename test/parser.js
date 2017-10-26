const GLBParser = require('../lib/glb-parser')

var assert = require('assert');

describe('GLBParser', function() {
  describe('parse', function() {
    it('Should have the right sized buffer', function() {
      const glb = GLBParser('./test/assets/BarramundiFish/glTF-Binary/BarramundiFish.glb')
      assert.equal(glb.json.buffers[0].byteLength, glb.buffer.byteLength)
    });
  });
});