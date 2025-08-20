#!/bin/bash

# Function to convert a page to use DashboardLayout
convert_page() {
  local file=$1
  echo "Converting $file..."
  
  # Create temporary file with new content
  cat << 'TEMPLATE' > temp-convert.tsx
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
TEMPLATE

  # Extract imports (skip the first few lines and DashboardLayout related imports)
  sed -n '4,40p' "$file" | grep -v "Sidebar" | grep -v "TopBar" | grep -v "DashboardLayout" >> temp-convert.tsx
  
  # Extract the function name and state
  echo "" >> temp-convert.tsx
  grep "export default function" "$file" >> temp-convert.tsx
  
  # Extract state variables and other logic before return
  awk '/export default function/,/return \(/ {
    if (!/export default function/ && !/return \(/ && !/sidebarOpen/ && !/setSidebarOpen/) print
  }' "$file" >> temp-convert.tsx
  
  # Start the return with DashboardLayout
  echo "  return (" >> temp-convert.tsx
  echo "    <DashboardLayout>" >> temp-convert.tsx
  
  # Extract content between main tags
  awk '/<main.*>/,/<\/main>/ {
    if (/<div className="max-w-7xl mx-auto">/) start=1
    if (start && !/<\/main>/) print
    if (/<\/div>.*<\/main>/) start=0
  }' "$file" | sed 's/^      //' >> temp-convert.tsx
  
  # Close DashboardLayout
  echo "    </DashboardLayout>" >> temp-convert.tsx
  echo "  );" >> temp-convert.tsx
  echo "}" >> temp-convert.tsx
  
  # Move the converted file
  mv "$file" "${file}.backup"
  mv temp-convert.tsx "$file"
}

# List of files to convert
files=(
  "app/work-plan/page.tsx"
  "app/transfer/page.tsx"
  "app/allocation/page.tsx"
  "app/master-data/page.tsx"
  "app/reports/page.tsx"
  "app/import-budget/page.tsx"
  "app/export/page.tsx"
  "app/compare/page.tsx"
  "app/dpis/page.tsx"
  "app/users/page.tsx"
  "app/settings/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    convert_page "$file"
  else
    echo "File not found: $file"
  fi
done

echo "Conversion complete!"
