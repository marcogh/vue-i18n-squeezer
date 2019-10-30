getTranslations = (content) => {
  //return content.match(/\$tc?[\r\n ]*["']\(.*\)["']/gm) || [];
  return [
    ...content.matchAll(/\$tc? *\([\r\n ]*["'`]([^'`"]+)["'`][^\)]*\)/gm),
    ...content.matchAll(/<i18n\s[^>]*?path="(.*?)"[^>]*>[\S\s]*?<\/i18n>/gm)
  ] || []
}

module.exports = getTranslations
