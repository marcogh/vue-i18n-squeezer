const assert = require("assert")
const getTranslations = require('../lib/getTranslations')
const matchAll = require('string.prototype.matchall')

matchAll.shim() // monkey patching missing matchAll

describe('Testing regural expression', function() {
    it('result should match test data', function(){
         let text = `
<i18n
  raw console="ok" test="12345"
  v-for="a in path" path="ciao {0}"  	

  DEMO
  BUBU
>
</i18n>

<i18n path="You can return to the {0}" tag="p" for="Homepage">
        <b-button href="/">{{ t('Homepage')}}</b-button>
        <b-button href="/">{{ $t('Homepage')}}</b-button>
        <b-button href="/">{{ tc('Homepage')}}</b-button>
        <b-button href="/">{{ $tc('Homepage')}}</b-button>
        <b-button href="/">{{ run_t('Homepage')}}</b-button>
        <b-button href="/">{{ run_tc('Homepage')}}</b-button>
</i18n>
`
         let result = getTranslations(text)
         assert.equal(result.length, 6)
    });
    it('result should match test data', function(){
         let text = `
  address: {
    name: 'ENTER_ADDRESS',
    description: VueI18n.t('Enter IP address'),
  },
  port: {
    name: "ENTER_PORT",
    description: VueI18n.t("Enter port number"),
  },
  token: {
    name: 'ENTER_TOKEN',
    description: VueI18n.t('Enter Token {0} value', [token])
  }
`
         let result = getTranslations(text)
         assert.equal(result.length, 3)
    });
})
