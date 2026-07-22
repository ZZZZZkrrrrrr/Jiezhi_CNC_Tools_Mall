#!/usr/bin/env bash
set -euo pipefail

if [ ! -f package.json ]; then
  npm create vite@latest . -- --template react-ts
fi

npm install react-router-dom zustand zod react-hook-form @hookform/resolvers i18next react-i18next clsx
npm install -D sass @playwright/test playwright vitest jsdom sharp pixelmatch pngjs eslint prettier axe-core @axe-core/playwright
npx playwright install chromium

mkdir -p reference/{screenshots,flows,network,assets,manifests,diffs} \
  src/{pages,components,features,data,assets,styles,i18n,services,types} \
  tests/e2e docs scripts

echo "Bootstrap complete. Run: codex --search --sandbox workspace-write --ask-for-approval on-request"
