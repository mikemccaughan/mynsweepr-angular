#!/bin/bash
npmCheckUpdatesAndInstall() {
    touch ./yarn.log; yarn dlx npm-check-updates -u -x /^@angular\/.*$/ /^typescript$/; yarn install > ./yarn.log; return 0;
}
updateBrowsersList() {
    touch ./update-browserslist-db.log; yarn dlx update-browserslist-db@latest > ./update-browserslist-db.log; if $(grep -q "Error Command failed:" "./update-browserslist-db.log"); then echo "Error updating browserslist database. Trying again..."; yarn dlx update-browserslist-db@latest &> ./update-browserslist-db.log; else echo "Browserslist database updated successfully."; fi; return 0;
}
updateDependencies() {
    if $(grep -q "high severity vulnerabilities" "./yarn.log") | $(grep -q "Fix the upstream dependency conflict" "./yarn.log"); then echo "High severity vulnerabilities or dependency conflicts found. Please review ./yarn.log for details. Running npm audit fix..."; yarn npm audit fix --force; yarn install --force > ./yarn.log; if $(grep -q "high severity vulnerabilities" "./yarn.log"); then echo "High severity vulnerabilities still found after yarn npm audit fix. Please review ./yarn.log for details."; return 1; else echo "No high severity vulnerabilities found after yarn npm audit fix."; fi; else echo "No high severity vulnerabilities found."; fi; if $(grep -q "high severity vulnerabilities" "./yarn.log") | $(grep -q "Fix the upstream dependency conflict" "./yarn.log"); then echo "High severity vulnerabilities or dependency conflicts found. Please review ./yarn.log for details. Running npm audit fix..."; yarn npm audit fix --force; yarn install --force > ./yarn.log; if $(grep -q "high severity vulnerabilities" "./yarn.log"); then echo "High severity vulnerabilities still found after yarn npm audit fix. Please review ./yarn.log for details."; exit 1; else echo "No high severity vulnerabilities found after npm audit fix."; fi; else echo "No high severity vulnerabilities found."; fi; return 0;
}
build() {
    touch ./ng-build.log; ng build -c production > ./ng-build.log;
}
deploy() {
    rm -r ../publish/mynsweepr-angular; cp -r dist/mynsweepr-angular/browser/ ../publish/mynsweepr-angular/; 
}
npmCheckUpdatesAndInstall && updateBrowsersList && build && deploy && echo "DONE with ${dirname $PWD}";