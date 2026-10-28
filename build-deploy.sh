#!/bin/bash
npmCheckUpdatesAndInstall() {
    touch ./npmi.log; npx npm-check-updates -u -x /^@angular\/.*$/ /^typescript$/; npm install > ./npmi.log; return 0;
}
updateBrowsersList() {
    touch ./update-browserslist-db.log; npx update-browserslist-db@latest > ./update-browserslist-db.log; if $(grep -q "Error Command failed:" "./update-browserslist-db.log"); then echo "Error updating browserslist database. Trying again..."; npx update-browserslist-db@latest &> ./update-browserslist-db.log; else echo "Browserslist database updated successfully."; fi; return 0;
}
updateDependencies() {
    if $(grep -q "high severity vulnerabilities" "./npmi.log") | $(grep -q "Fix the upstream dependency conflict" "./npmi.log"); then echo "High severity vulnerabilities or dependency conflicts found. Please review ./npmi.log for details. Running npm audit fix..."; npm audit fix --force; npm install --force > ./npmi.log; if $(grep -q "high severity vulnerabilities" "./npmi.log"); then echo "High severity vulnerabilities still found after npm audit fix. Please review ./npmi.log for details."; return 1; else echo "No high severity vulnerabilities found after npm audit fix."; fi; else echo "No high severity vulnerabilities found."; fi; if $(grep -q "high severity vulnerabilities" "./npmi.log") | $(grep -q "Fix the upstream dependency conflict" "./npmi.log"); then echo "High severity vulnerabilities or dependency conflicts found. Please review ./npmi.log for details. Running npm audit fix..."; npm audit fix --force; npm install --force > ./npmi.log; if $(grep -q "high severity vulnerabilities" "./npmi.log"); then echo "High severity vulnerabilities still found after npm audit fix. Please review ./npmi.log for details."; exit 1; else echo "No high severity vulnerabilities found after npm audit fix."; fi; else echo "No high severity vulnerabilities found."; fi; return 0;
}
build() {
    touch ./ng-build.log; ng build -c production > ./ng-build.log;
}
deploy() {
    rm -r ../publish/mynsweepr-angular; cp -r dist/mynsweepr-angular/browser/ ../publish/mynsweepr-angular/; 
}
npmCheckUpdatesAndInstall(); updateBrowsersList(); build(); deploy(); echo "DONE with ${dirname $PWD}";