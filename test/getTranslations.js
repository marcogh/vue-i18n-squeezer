const assert = require("assert")
const getTranslations = require('../lib/getTranslations')
const matchAll = require('string.prototype.matchall')

matchAll.shim() // monkey patching missing matchAll

describe('Regex', function() {
    it('should match', function(){
         let text = `
<i18n
  raw console="ok" test="12345"
  v-for="a in path" path="ciao {0}"  	

  DEMO
  BUBU
>
</i18n>

<i18n path="You can return to the {0}" tag="p" for="Homepage">
        <b-button href="/">{{ $t('Homepage')}}</b-button>
</i18n>
`
         let result = getTranslations(text)
         assert.equal(result.length, 2)
    })
})
