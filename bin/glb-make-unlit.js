#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const GLBParser = require('../lib/glb-parser')
const GLBWriter = require('../lib/glb-writer')

const src = process.argv[2]
console.log(`>> Unpacking ${src}`)

const glb = GLBParser(src)

glb.json.extensionsUsed = glb.json.extensionsUsed || []
glb.json.extensionsUsed.push("KHR_materials_common")
glb.json.extensionsUsed.push("KHR_materials_unlit")

console.log(glb.json.materials)
glb.json.materials.forEach((m) => {
	m.extensions = m.extensions || {}
	m.extensions.KHR_materials_common = {
		 type: "commonConstant"
	}
	m.extensions.KHR_materials_unlit = {}
})
console.log(glb.json.materials)

const output = src.replace('.glb', '.unlit.glb')
GLBWriter(glb, output)
