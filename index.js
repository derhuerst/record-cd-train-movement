import _cdWifiClient from 'cd-wifi-client'
const {acknowledgeCaptivePortal, asEventEmitter} = _cdWifiClient
import {EventEmitter} from 'node:events'

const subscribeToMovement = () => {
	const positions = asEventEmitter()
	const out = new EventEmitter()

	let prevLatitude = NaN, prevLongitude = NaN
	positions.on('data', (ev) => {
		if (
			(Number.isFinite(ev.prevLatitude) && ev.prevLatitude !== prevLatitude)
			|| (Number.isFinite(ev.prevLongitude) && ev.prevLongitude !== prevLongitude)
		) {
			const fakeEv = {
				...ev,
				// todo: prev t, altitude, speed, delay?
				latitude: ev.prevLatitude,
				longitude: ev.prevLongitude,
			}
			out.emit('position', fakeEv)
			prevLatitude = ev.prevLatitude
			prevLongitude = ev.prevLongitude
		}

		if (
			ev.latitude !== prevLatitude
			|| ev.longitude !== prevLongitude
		) {
			out.emit('position', ev)
			prevLatitude = ev.latitude
			prevLongitude = ev.longitude
		}
	})

	return out
}

export {
	acknowledgeCaptivePortal,
	subscribeToMovement,
}
