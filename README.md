# glbutils

Utility for inspecting and modifying gltf binary files

# Installation

`npm install -g glbutils`

# Usage

`glb-utils path/to/glb-file.glb optional/path/to/write/to.glb`

If you want to modify the json in a glb file, first copy it to the clipboard (Opt 1), modify it in the editor of your choice, then paste it back into glb-utils (Opt 2) and write it out to the destination (Opt 3)

## Features

- Modify the json and keep byte alignment correct
- View Formatted json

# Binaries

## glb-pack

Packs a gltf file and neighboring .bin and .image files into a glb binary

## glb-unpack

Unpacks a glb file into a readable .gltf file and writes out the .bin file and images as separate files.

These images can't be edited and repacked, but that is coming.
