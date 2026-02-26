#!/bin/bash

# Lighthouse Testing Script for NotesNinja
# Run this after starting production server

echo "🚀 NotesNinja Lighthouse Testing"
echo "================================"
echo ""

# Check if server is running
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Server not running. Start it first with:"
    echo "   npm start"
    exit 1
fi

echo "✅ Server is running on http://localhost:3001"
echo ""

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "📦 Installing Lighthouse CLI..."
    npm install -g lighthouse @lhci/cli
fi

echo "🔍 Running Lighthouse Audit..."
echo ""

# Create reports directory
mkdir -p lighthouse-reports

# Run Lighthouse audit
lighthouse http://localhost:3001 \
  --preset=mobile \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=html \
  --output=json \
  --output-path=./lighthouse-reports/report-$(date +%Y%m%d-%H%M%S) \
  --chrome-flags="--headless --no-sandbox" \
  --view

echo ""
echo "✅ Lighthouse audit complete!"
echo ""
echo "📊 Report saved to: lighthouse-reports/"
echo ""
echo "🎯 Expected Scores:"
echo "   Performance:    90+ (was 60)"
echo "   Accessibility:  95+ (was 83)"
echo "   Best Practices: 96  (was 96)"
echo "   SEO:           100  (was 100)"
echo ""
echo "📈 Key Metrics Targets:"
echo "   LCP: < 2.5s  (was 7.6s)"
echo "   FCP: < 1.8s  (was 3.0s)"
echo "   TBT: < 150ms (was 290ms)"
echo "   CLS: < 0.1   (was 0)"
echo ""
