#!/bin/sh
#
# runs eslint on all added or modified JavaScript files
#
source ~/.bash_profile

files=$(git diff --exit-code --cached --name-only --diff-filter=ACM -- '*.js' '*.jsx')
$(exit $?) || echo $files | ./node_modules/.bin/eslint $files
