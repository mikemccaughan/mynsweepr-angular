#!/bin/bash
cd ~/Source/Repos/mynsweepr-angular &&
nvm install lts --latest-npm &&
nvm use lts &&

touch npmi.log &&

npx npm-check-updates -u &&
npm install &> npmi.log &&

touch update-browserslist-db.log &&

npx update-browserslist-db@latest &> update-browserslist-db.log
if $(grep -q "ErrorL Command failed:" "update-browserslist-db.log"); then
  echo "Error updating browserslist database. Trying again..." &&
  npx update-browserslist-db@latest &> update-browserslist-db.log
else
  echo "Browserslist database updated successfully."
fi

if $(grep -q "high severity vulnerabilities" "npmi.log") | $(grep -q "Fix the upstream dependency conflict" "npmi.log"); then
  echo "High severity vulnerabilities or dependency conflicts found. Please review npmi.log for details. Running npm audit fix..." &&
  npm audit fix --force &&
  npm install --force &> npmi.log
  if $(grep -q "high severity vulnerabilities" "npmi.log"); then
    echo "High severity vulnerabilities still found after npm audit fix. Please review npmi.log for details." &&
    exit 1
  else
    echo "No high severity vulnerabilities found after npm audit fix."
  fi
else
  echo "No high severity vulnerabilities found."
fi

touch ng-build.log &&

ng build -c production &> ng-build.log &&

cp -r ~/Source/Repos/publish/mynsweepr-angular/dist/* ~/Source/Repos/heretic-monkey.link/publish/mynsweepr-angular/
