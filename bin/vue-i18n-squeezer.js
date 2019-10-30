#!/usr/bin/env node

const glob = require('glob')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const matchAll = require('string.prototype.matchall')
const getTranslations = require('../lib/getTranslations')

matchAll.shim() // monkey patching missing matchAll

const basePath = path.resolve(process.cwd())
const packageJson = JSON.parse(fs.readFileSync(path.join(basePath, 'package.json')).toString())

let msgstrs = {}

updateLocales = (localeFiles, defaultLocale) => {
  //locales = []
  let files = glob.sync(localeFiles)
  files.forEach( (localeFile) => {
    let [_, locale] = localeFile.match(/\/([a-zA-Z_-]+)\.json$/)
    console.log(`import ${locale} locales from ${localeFile} ...`)
    fs.copyFileSync(localeFile, `${localeFile}.old`)
    let localeData = JSON.parse(fs.readFileSync(localeFile))
    msgstrs.translations.forEach( (msg) => {
      if (!Object.keys(localeData).includes(msg)) {
        if ( defaultLocale === locale) {
          localeData[msg] = msg // stesso valore
        } else {
          localeData[msg] = null
        }
      }
    })
    fs.writeFileSync(localeFile, JSON.stringify(localeData, null, 2))
  })
}

runImport = (vueFiles) => {
  const translations = []
  const pluralTranslations = []

  let files = glob.sync(vueFiles)
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

require('yargs')
  .scriptName('vue-i18n-squeezer')
  .usage('$0 <cmd> [args]')
  .command('update', 'update the translations', {
    vueFiles: {
      type: 'string',
      describe: 'The Vue.js files you want to extract translations from',
      demand: true,
      alias: 'v',
    },
    localeFiles: {
      type: 'string',
      describe: 'The .json translation files you want to update',
      demand: true,
      alias: 'l',
    },
    defaultLocale: {
      type: 'string',
      describe: 'The default fallback locale. USE \'en\'',
      default: 'en',
    }
  }, (argv) => {
    const command = argv
    runImport(command.vueFiles)
    updateLocales(command.localeFiles, command.defaultLocale)
  })
  .help()
  .demandCommand(1, '')
  .showHelpOnFail(true)
  .argv
