#!/bin/bash
# Fallback script for Railway Railpack
if [ -f "package.json" ]; then
  npm install
  npm start
else
  # If Docker is used, this script might not even be needed, 
  # but Railpack looking for it at the root will find this.
  nginx -g 'daemon off;'
fi
