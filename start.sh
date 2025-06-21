#!/bin/bash
echo "Starting CPRSCAC Angular Development Server..."
echo "Make sure you're using Node.js v20.19.0 or higher"
echo ""

# Check Node.js version
node_version=$(node --version)
echo "Current Node.js version: $node_version"

# Start the Angular development server
echo "Starting server on http://localhost:4200"
ng serve --port 4200 