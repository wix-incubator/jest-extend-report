#!/usr/bin/env bash

for file in $(find packages/fixtures/29.x.x -name "*.uml" -type f)
do
  echo "$file"
  plantuml -tsvg "$file"
done
