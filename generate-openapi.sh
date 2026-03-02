#!/bin/bash

npx tsoa spec-and-routes

npx @openapitools/openapi-generator-cli generate \
  -i ./build/swagger.json \
  -g typescript-fetch \
  -o ./client