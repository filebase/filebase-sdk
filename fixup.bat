@echo off

set "distPath=dist"
if not exist "%distPath%" (
    mkdir "%distPath%"
)

set "cjsPath=dist/cjs"
if not exist "%cjsPath%" (
    mkdir "%cjsPath%"
)
echo {"type": "commonjs"} > "%cjsPath%/package.json"

set "ejsPath=dist/mjs"
if not exist "%ejsPath%" (
    mkdir "%ejsPath%"
)
echo {"type": "module"} > "%ejsPath%/package.json"
