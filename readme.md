# record-cd-train-movement

**Record the movement of a [České Dráhy (Czech Railways)](https://en.wikipedia.org/wiki/České_dráhy) train using its on-board WiFi (*CDWiFi*).**

[![npm version](https://img.shields.io/npm/v/record-cd-train-movement.svg)](https://www.npmjs.com/package/record-cd-train-movement)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/record-cd-train-movement.svg)
![minimum Node.js version](https://img.shields.io/node/v/record-cd-train-movement.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installation

```shell
npm install record-cd-train-movement
```


## Usage

```
Usage:
    record-cd-train-movement >file.ndjson
Options:
    --acknowledge-captive-portal  First attempt to acknowledge CD Wifi's captive portal.
                                    Default: false
Examples:
    record-cd-train-movement --acknowledge-captive-portal | tee -a ec-179-praha.ndjson
```


## Contributing

If you have a question or need support using `record-cd-train-movement`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/record-cd-train-movement/issues).
