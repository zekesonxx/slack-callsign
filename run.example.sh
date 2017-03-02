#!/usr/bin/env bash

# Slack application validation command
export SCS_VALIDATION_TOKEN='token'

# HamQTH login information
# Used to retrieve lookups
export SCS_HAMQTH_USERNAME='ve7kfm'
export SCS_HAMQTH_PASSWORD='hunter2'

# The port for the server to listen on
# Slack requires HTTPS, and slack-callsign does not do HTTPS itself
# You'll need a reverse proxy of some sort.
export SCS_PORT='3000'

exec "$PWD/bin/www"
