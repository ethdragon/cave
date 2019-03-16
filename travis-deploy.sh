#!/bin/bash
if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "NOT deploying: Deploying only on master, but this is $TRAVIS_BRANCH."
else
  sls deploy --stage prod --force
fi
