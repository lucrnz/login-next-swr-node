#!/bin/bash

_container_tool() {
  if command -v docker &>/dev/null; then
    docker $@
  elif command -v podman &>/dev/null; then
    podman $@
  else
    echo "Error: Neither Docker nor Podman found in the system." >&2
    exit 1
  fi
}

SCRIPT_PATH=$(dirname "$(readlink -f "$0")")
PROGRAM_PATH=$(dirname "$SCRIPT_PATH")

_container_tool build --no-cache -t "login-swr-be" $PROGRAM_PATH