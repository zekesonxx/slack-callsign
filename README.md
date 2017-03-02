# slack-callsign

A mildly-brittle Slack slash command for doing amateur radio callsign lookups using HamQTH.

## Setup
1. Clone repo
2. `npm i`
3. Copy `run.example.sh` to `run.sh`
4. Fill in the variables in `run.sh`
5. `./run.sh`.

slack-callsign should automatically get and update the session ID needed by HamQTH for lookups

## Debugging

`DEBUG=scs* ./run.sh` will output debugging information

## License
GPL3. See `LICENSE`.
