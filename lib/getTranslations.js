getTranslations = (content) => {
  return [
    ...content.matchAll(/(?<![\$a-zA-Z0-9\.,_])\$?tc?\((["'])(.*?[^\\])\1\)/gm),
    // ...content.matchAll(/\stc? *\([\r\n ]*["]([^"]+)["][^\)]*\)/gm),
    // ...content.matchAll(/\stc? *\([\r\n ]*[']([^']+)['][^\)]*\)/gm),
    ...content.matchAll(/<i18n\s[^>]*?path="(.*?)"[^>]*>[\S\s]*?<\/i18n>/gm),
    ...content.matchAll(/VueI18n\.t\([\r\n ]*["]([^"]+)["][^\)]*\)/gm),
    ...content.matchAll(/VueI18n\.t\([\r\n ]*[']([^']+)['][^\)]*\)/gm)
  ] || []
}

module.exports = getTranslations
