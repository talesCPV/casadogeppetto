#!/bin/bash
# Upload files to Github - git@github.com:talesCPV/casadogeppetto.git

read -p "Are you sure to commit casadogeppetto to GitHub ? (Y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then

    git init

    git add assets/
    git add files/
    git add style/
    git add templates/
    git add index.html
    git add commit.sh

    git commit -m "by_script"

    git branch -M master
#    git remote add origin git@github.com:talesCPV/casadogeppetto.git
    git remote set-url origin git@github.com:talesCPV/casadogeppetto.git

    git push -u -f origin master

fi