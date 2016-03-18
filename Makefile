export SHELL := /bin/bash
export PATH  := node_modules/.bin:$(PATH)

lint:
	eslint src/

build:
	rollup -f iife -o ./dist/web/moz_intl.js src/targets/web.js
	rollup -f iife -o ./dist/gaia/moz_intl.js src/targets/gaia.js

.PHONY: lint
