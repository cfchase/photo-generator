#!/usr/bin/env bash

MY_ROUTE=http://localhost:5000


curl "${MY_ROUTE}/api/status"
curl -X POST -H "Content-Type: application/json" -d '{"prompt" : "a photo of rhteddy on the beach"}' ${MY_ROUTE}/api/predictions


