#!/usr/bin/env bash
# This script copies data from one repo to another repo. The reason, why Dataset dashboard does not run over the original repo
# is that it needs some inference (e.g. subclassof) that is not available in the original repo

FROM=http://onto.fel.cvut.cz/rdf4j-server/repositories/descriptors-metadata
TO=http://onto.fel.cvut.cz/rdf4j-server/repositories/descriptors-metadata-inferred

curl -X GET -H "Accept: application/trix" -o /tmp/ddo-data.trix $FROM/statements

echo "OK"

curl -X POST -d "@/tmp/ddo-data.trix" $TO/statements -H "Content-Type: application/trix"

echo "OK2"
