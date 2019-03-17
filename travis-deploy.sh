#!/bin/bash
if [ "${TRAVIS_BRANCH}" != "master" ] || [ "${TRAVIS_PULL_REQUEST}" != "false" ]
then
  echo "NOT deploying: Deploying only on master, but this is $TRAVIS_BRANCH."
else
  sls deploy --stage prod --force
fi

# sls package --package dist/.serverless
# ls -la dist/.serverless
sls deploy --stage prod --force --verbose
