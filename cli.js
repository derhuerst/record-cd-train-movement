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
		'acknowledge-captive-portal': {
			type: 'boolean',
		},
		'gpsd-json': {
			type: 'boolean',
		},
	},
})

if (flags.help) {
	process.stdout.write(`
Usage:
    record-cd-train-movement >file.ndjson
Options:
    --acknowledge-captive-portal  First attempt to acknowledge CD Wifi's captive portal.
                                    Default: false
    --gpsd-json                   Print GPSd-compatible \`TPV\` JSON messages to stdout,
                                    in order to use gpsd to use Wifi's position data as
                                    a GPSd [1] data source.
                                    Default: false
                                    [1] https://gpsd.gitlab.io/gpsd/
Examples:
    record-cd-train-movement --acknowledge-captive-portal | tee -a ec-179-praha.ndjson
    # provide GPSd-compatible JSON messages on tcp://localhost:2947
    record-cd-train-movement --gpsd-json | ncat -l 2947 -k --send-only
\n`)
	process.exit(0)
}

if (flags.version) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}


import {acknowledgeCaptivePortal, subscribeToMovement} from './index.js'

const printPosition = (ev) => {
	if (flags['gpsd-json']) {
		// > good for latitude/longitude
		// https://gitlab.com/gpsd/gpsd/-/blob/31767de1480880f5dd48090262d92e8c1c94eaab/include/gps.h#L184
		const MODE_2D = 2
		// > good for altitude/climb too
		// https://gitlab.com/gpsd/gpsd/-/blob/31767de1480880f5dd48090262d92e8c1c94eaab/include/gps.h#L185
		const MODE_3D = 3
		// > with GNSS + dead reckoning
		// https://gitlab.com/gpsd/gpsd/-/blob/31767de1480880f5dd48090262d92e8c1c94eaab/include/gps.h#L200
		const STATUS_GNSSDR = 6

		// https://gpsd.gitlab.io/gpsd/gpsd_json.html#_tpv
		// > A TPV object is a time-position-velocity report. The "class" and "mode" fields will reliably be present. […]
		return {
			class: 'PTV',
			device: 'cdwifi.cz',
			mode: Number.isFinite(ev.altitude) ? MODE_3D : MODE_2D,
			status: STATUS_GNSSDR,
			// todo: configurable time zone offset
			time: Number.isInteger(ev.t) ? new Date(ev.t).toISOString() : undefined,
			altHAE: Number.isFinite(ev.altitude) ? ev.altitude : undefined,
			// todo: `ept` ("Estimated time stamp error in seconds. Certainty unknown.")
			lat: ev.latitude,
			lon: ev.longitude,
			// todo: obtain `track` ("Course over ground, degrees from true north.") somehow?
			speed: ev.speed,
		}
	}

	return {
		latitude: ev.latitude,
		longitude: ev.latitude,
		altitude: ev.altitude,
		speed: ev.speed,
		t: Date.now() / 1000 | 0,
	}
}

const acknowledgeLegalTerms = async (terms) => {
	process.stderr.write(`CD Wifi legal terms:\n\n${terms}\n`)
}
if (flags['acknowledge-captive-portal']) {
	await acknowledgeCaptivePortal(acknowledgeLegalTerms)
}

const positions = subscribeToMovement()

positions.on('error', (err) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	else console.error(err.message || (err + ''))
	process.exitCode = 1
})

positions.on('position', printPosition)
