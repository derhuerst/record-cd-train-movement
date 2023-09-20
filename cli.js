#!/usr/bin/env node

// todo: use import assertions once they're supported by Node.js & ESLint
// https://github.com/tc39/proposal-import-assertions
import {createRequire} from 'module'
const require = createRequire(import.meta.url)

import {parseArgs} from 'node:util'
const pkg = require('./package.json')

const {
	values: flags,
} = parseArgs({
	options: {
		help: {
			type: 'boolean',
			short: 'h',
		},
		version: {
			type: 'boolean',
			short: 'v',
		},
	},
})

if (flags.help) {
	process.stdout.write(`
Usage:
    record-cd-train-movement >file.ndjson
\n`)
	process.exit(0)
}

if (flags.version) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}


import {subscribeToMovement} from './index.js'

const printPosition = (ev) => {
	return {
		latitude: ev.latitude,
		longitude: ev.latitude,
		altitude: ev.altitude,
		speed: ev.speed,
		t: Date.now() / 1000 | 0,
	}
}

const positions = subscribeToMovement()

positions.on('error', (err) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	else console.error(err.message || (err + ''))
	process.exitCode = 1
})

positions.on('position', printPosition)
