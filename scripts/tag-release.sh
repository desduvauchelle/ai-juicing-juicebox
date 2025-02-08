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

# Get version from root package.json
version=$(jq -r '.version' package.json)
echo "Root version: $version"

# Update versions in workspace package.json files
for dir in "apps/desktop" "apps/web"; do
  pkg="$dir/package.json"
  if [ -f "$pkg" ]; then
    echo "Updating $pkg..."
    jq --arg ver "$version" '.version = $ver' "$pkg" > "$pkg.tmp" && mv "$pkg.tmp" "$pkg"
  else
    echo "$pkg not found!"
  fi
done

# Commit the change
git add .
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
