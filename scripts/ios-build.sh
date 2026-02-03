#!/usr/bin/env bash
set -euo pipefail

# iOS 构建仅支持 macOS + Xcode
if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "iOS 构建仅支持在 macOS 上运行（需要 Xcode）。"
  exit 1
fi

npm install
npm run build

if [[ ! -d "ios" ]]; then
  npx cap add ios
fi

npx cap sync ios
npx cap open ios
