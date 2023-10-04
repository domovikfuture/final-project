#!/bin/bash

nodemon backend/server.js -V   \
  --ignore backend/links.json  \
  --ignore uploads/** \
  --ignore images/** \
  --ignore frontend/public/** 