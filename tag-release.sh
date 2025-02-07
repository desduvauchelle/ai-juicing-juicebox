#!/bin/bash

# Exit on error
set -e

# Get current version from package.json
CURRENT_VERSION=$(cat package.json | jq -r .version)

if [ -z "$CURRENT_VERSION" ]; then
	echo "Error: Could not read version from package.json"
	exit 1
fi

# Increment the version (assuming semantic versioning)
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
VERSION_PARTS[2]=$((VERSION_PARTS[2] + 1))
NEW_VERSION="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.${VERSION_PARTS[2]}"

# Update package.json with new version
jq --arg new_version "$NEW_VERSION" '.version = $new_version' package.json > package.tmp.json && mv package.tmp.json package.json

# Commit the change
git add package.json
git commit -m "Bump version to $NEW_VERSION"

# Create and push tag
TAG="v$NEW_VERSION"
echo "Creating tag $TAG..."

# Create annotated tag
git tag -a $TAG -m "Release version $NEW_VERSION"

# Push commit and tag to remote
git push origin main
git push origin $TAG

echo "Successfully updated version to $NEW_VERSION, committed the change, and pushed tag $TAG"
