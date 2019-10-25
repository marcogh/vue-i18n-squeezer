#!/usr/bin/env node

const glob = require('glob')
const fs = require('fs')
const path = require('path')
const compiler = require('vue-template-compiler')
const matchAll = require('string.prototype.matchall');

matchAll.shim() // monkey patching missing matchAll

const basePath = path.resolve(process.cwd())
const packageJson = JSON.parse(fs.readFileSync(path.join(basePath, 'package.json')).toString())
const supportedLocales = packageJson.config['supported-locales']
const defaultLocale = packageJson.config['default-locale']

getTranslations = (content) => {
  //return content.match(/\$tc?[\r\n ]*["']\(.*\)["']/gm) || [];
  return content.matchAll(/\$tc? *\([\r\n ]*["']([^'"]+)["'][^\)]*\)/gm) || []
}

importLocales = () => {
  locales = []
  supportedLocales.forEach( (item) => {
    console.log(item)
    localeFile = fs.readFileSync(path.join(basePath, `src/locales/${item}.json`))
    locales.push(
      JSON.parse(localeFile)
    )
    // load translation item
    
  })
  console.log(locales)
}

exportLocales = () => {

}

runImport = () => {
  const translations = []
  const pluralTranslations = []

  let files = glob.sync('src/**/*.vue')
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
  return JSON.stringify({
    'translations': translations,
    'plural_translations': pluralTranslations
  }, null, 2)
}

runExport: () => {

}

switch (process.argv[2]){
  case 'import':
    let imported = runImport()
    console.log(imported)
    importLocales()
    break

  case 'export':
    let exported = runExport()
    console.log(exported)

    break

  default:
    console.log('vue-i18n-exfiltrate')
    console.log(' usage:')
    console.log('   vue-i18n-exfiltrate export')
    console.log('     imports translations from source')
    console.log('   vue-i18n-exfiltrate import')
    console.log('     exports translations to source')
  
}