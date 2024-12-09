#!/usr/bin/env bash

# Update package lists
apt-get update

# Install necessary dependencies
apt-get install -y wget gnupg

# Add Google Chrome's signing key
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -

# Add Google Chrome's repository
sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'

# Update package lists again
apt-get update

# Install Google Chrome
apt-get install -y google-chrome-stable