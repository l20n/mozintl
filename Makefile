export SHELL := /bin/bash
export PATH  := node_modules/.bin:$(PATH)

lint:
	eslint src/

build:
	rollup -f iife -o ./dist/moz_intl.js src/index.js

.PHONY: lint
