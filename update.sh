#!/bin/bash
#
#
VER="$1"
if [ -z "$VER" ]; then
    VER="auto"
    # echo
    # echo "$0 <VERSION>"
    # echo
    # exit
fi

set -e
set -x

cd "$( dirname "$0" )"

git fetch upstream

if [ "$VER" == "auto" ]; then
    VER=$( git tag --sort=v:refname | tail -n1 )
    #exit
fi

CUR=$( git describe --tags | cut -d- -f1 )
if [ "$CUR" == "$VER" ]; then
    echo
    echo $VER already installed
    echo
    exit
fi

git rebase "$VER"
bun run build:native
git push --force-with-lease
git push --tags
