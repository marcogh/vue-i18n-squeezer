#!/usr/bin/env node

const glob = require('glob')
const fs = require('fs')
const path = require('path')
const compiler = require('vue-template-compiler')
const matchAll = require('string.prototype.matchall');

matchAll.shim()

parseTemplates: () => {

}

getTranslations = (content) => {
  //return content.match(/\$tc?[\r\n ]*["']\(.*\)["']/gm) || [];
  return content.matchAll(/\$tc? *\([\r\n ]*["']([^'"]+)["'][^\)]*\)/gm) || []
}

runImport = () => {
  const basePath = path.resolve(process.cwd())
  const packageJson = JSON.parse(fs.readFileSync(path.join(basePath, 'package.json')).toString())
  //console.log(packageJson)
  glob('src/**/*.vue', (err, files) => {
    const translations = []
    const pluralTranslations = []
    files.forEach(file => {
      //console.log(`checking ${file}`)
      let content = fs.readFileSync(file).toString()
      for(let match of getTranslations(content)){
        if ( match[0].match(/\$tc.*/) ){
          pluralTranslations.push(match[1])
        } else {
          translations.push(match[1])
        }
      }
    })
    console.log(JSON.stringify(translations))
    console.log(JSON.stringify(pluralTranslations))
  })
}

runExport: () => {

}

switch (process.argv[2]){
  case 'import':
    runImport()
    break

  case 'export':
    runExport()
    break

  default:
    console.log('vue-i18n-exfiltrate')
    console.log(' usage:')
    console.log('   vue-i18n-exfiltrate export')
    console.log('     imports translations from source')
    console.log('   vue-i18n-exfiltrate import')
    console.log('     exports translations to source')
  
}