const ncp = require("copy-paste");
const GLBParser = require('./glb-parser')
const GLBWriter = require('./glb-writer')
const menu = require('node-menu')

const infile = process.argv[2]
const outfile = process.argv[3]

if (!infile) {
  console.log("Usage: node glb-utils.js path/to/glb-to-read path/to/glb-to-write")
  process.exit()
}

const glb = GLBParser(infile)

menu.customHeader(function() {
  console.log(`>>>> ${infile}`)
  console.log(`>>>> Version: ${glb.version}`)
  console.log("")
})

menu.disableDefaultPrompt()

menu.addItem('Copy JSON to clipboard', function() {
  ncp.copy(JSON.stringify(glb.json, null, 2))
  console.log("JSON Copied to clipboard")
})

menu.addItem('Replace JSON from clipboard', require('./actions/replace-json-from-clipboard'), glb)
menu.addItem(`Write GLB To ${outfile}`, function() {
  GLBWriter(glb, outfile)
})
menu.addItem('View JSON', require('./actions/print-json'), glb)
menu.addItem('View Shaders', require('./actions/view-shaders'), glb)

menu.start()
