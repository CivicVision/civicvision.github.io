#!/bin/bash

# Automated deploy script with Circle CI.

# Exit if any subcommand fails.
set -e

# Variables
ORIGIN_URL=`git config --get remote.origin.url`

echo "Started deploying"

# Push to gh-pages.
git config --global user.name "$USER_NAME"
git config --global user.email "$USER_EMAIL"

bundle exec middleman deploy
echo "Deployed Successfully!"

exit 0
