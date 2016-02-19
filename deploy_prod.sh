#!/bin/bash

# Automated deploy script with Circle CI.

# Exit if any subcommand fails.
set -e

# Variables
ORIGIN_URL=`git config --get remote.origin.url`

echo "Started deploying"

bundle exec middleman build

# Push to gh-pages.
git config user.name "$USER_NAME"
git config user.email "$USER_EMAIL"

bundle exec middleman deploy
echo "Deployed Successfully!"

exit 0
