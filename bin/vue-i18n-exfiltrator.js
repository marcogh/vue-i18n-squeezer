#!/usr/bin/env node

const glob = require('glob')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const matchAll = require('string.prototype.matchall');

matchAll.shim() // monkey patching missing matchAll

const basePath = path.resolve(process.cwd())
const packageJson = JSON.parse(fs.readFileSync(path.join(basePath, 'package.json')).toString())
const supportedLocales = packageJson.config['supported-locales']
const defaultLocale = packageJson.config['default-locale']

let msgstrs = {}

getTranslations = (content) => {
  //return content.match(/\$tc?[\r\n ]*["']\(.*\)["']/gm) || [];
  return content.matchAll(/\$tc? *\([\r\n ]*["'`]([^'`"]+)["'`][^\)]*\)/gm) || []
}

updateLocales = () => {
  //locales = []
  supportedLocales.forEach( (locale) => {
    console.log(`importing ${locale} locales...`)
    let localeFileName = path.join(basePath, `src/locales/${locale}.json`)
    fs.copyFileSync(localeFileName, `${localeFileName}.old`)
    let localeData = JSON.parse(fs.readFileSync(localeFileName))
    //console.log(localeData)
    msgstrs.translations.forEach( (msg) => {
      if (!Object.keys(localeData[locale]).includes(msg)) {
        if ( defaultLocale === locale) {
          localeData[locale][msg] = msg // stesso valore
        } else {
          localeData[locale][msg] = null
        }
      }
    })
    // load translation item
    //console.log(localeData)
    fs.writeFileSync(localeFileName, JSON.stringify(localeData, null, 2))
    
  })
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
  msgstrs = {
    'translations': translations,
    'plural_translations': pluralTranslations
  }
}

runExport = () => {

}

main = () => {
  runImport()
  updateLocales()
}

main()

// switch (process.argv[2]){
  // case 'import':
    // runImport()
    // updateLocales()
    // break

  // case 'export':
    // let exported = runExport()
    // console.log(exported)
    // break

  // default:
    // console.log('vue-i18n-exfiltrate')
    // console.log(' usage:')
    // console.log('   vue-i18n-exfiltrate export')
    // console.log('     imports translations from source')
    // console.log('   vue-i18n-exfiltrate import')
    // console.log('     exports translations to source')
// }