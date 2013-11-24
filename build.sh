#!/bin/bash
rm ./js/g2w.js
tsc --out ./js/g2w.js ./ts/build.ts --module "commonjs" --removeComments
