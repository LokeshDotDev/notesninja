#!/bin/bash

# Server cleanup script - reduces disk bloat on DigitalOcean
# Run this before deploying or periodically on your server

echo "🧹 Starting server cleanup..."

# Clean build artifacts
echo "Removing .next build cache..."
rm -rf .next/

# Clean old reports
echo "Cleaning old reports..."
rm -rf lighthouse-reports/*

# Clean npm cache on server (if running node)
echo "Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true

# Clean yarn cache if using yarn
if command -v yarn &> /dev/null; then
  echo "Cleaning yarn cache..."
  yarn cache clean 2>/dev/null || true
fi

# Remove turbo cache
echo "Cleaning turbo cache..."
rm -rf .turbo/

# Remove eslint cache
echo "Cleaning eslint cache..."
rm -f .eslintcache

# Remove build logs
echo "Removing old logs..."
find . -name "*.log" -type f -delete 2>/dev/null || true

echo "✅ Cleanup complete!"
echo ""
echo "Before cleanup - run: du -sh ./"
echo "After cleanup - run: du -sh ./"
