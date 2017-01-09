#!/bin/bash

find src test -path "*.ts" | xargs $(npm bin)/tslint --type-check --fix
