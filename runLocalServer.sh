#!/bin/bash
EXEC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd)"

# Optional argument for port defaulting to 9000
PORT=${1:-9000}

echo "Starting webserver on port $PORT to allow markdown includes."
if [ -x "$(command -v python3)" ]; then
  echo " Using python3"
  pushd "${EXEC_DIR}"; python3 -m http.server $PORT; popd
# python 2 can use:
#  pushd "${EXEC_DIR}"; python -m SimpleHTTPServer $PORT; popd
elif [ -x "$(command -v ruby)" ]; then
  echo " Using ruby"
  ruby -run -ehttpd "${EXEC_DIR}" -p$PORT
elif [ -x "$(command -v busybox)" ]; then
  echo " Using busybox"
  busybox httpd -v -p $PORT -h "${EXEC_DIR}"
else
  echo "Failed to find python3, ruby or busybox - no webserver started."
fi
