var _ = require('lodash')
var Q = require('q')

var searchResults2json = require('./utils/search-results2json')

var request = function(options) {
  var request = require('request')
  return Q.denodeify(request)(options)
    .then(function(results) {
      return results[0]
    })
}

var controller = {
  home: function*() {
    this.state.characters = [{
      color: '#5F5A5C',
      name: 'homura'
    }, {
      color: '#FED4D7',
      name: 'madoka'
    }, {
      color: '#F9E797',
      name: 'mami'
    }, {
      color: '#89BBCB',
      name: 'sayaka'
    }, {
      color: '#BE6F81',
      name: 'kyoko'
    }]

    this.body = yield this.render('home', this.state)
  },
  search: function*() {
    var scope = this.query.scope
    var query = this.query.query

    var searchResponse

    switch (scope) {
      case 'itunes-hk':
      case 'itunes-jp':
      case 'itunes-tw':
      case 'itunes-us':
      case 'itunes-uk':
        scope = _.template('itunes.apple.com/<%= region %>/album')({
          region: _.trimLeft(scope, 'itunes-')
        })
        break
      case 'amazon-com':
        scope = 'amazon.com'
        break
      case 'amazon-jp':
        scope = 'amazon.co.jp'
        break
      case 'orpheus':
        scope = 'music.163.com/album'
        break
      case 'qq':
        scope = 'y.qq.com/y/static'
        break
      default:
        scope = ''
        break
    }

    try {
      searchResponse = yield request({
        // baseUrl: 'https://www.google.com',
        // url: '/search',
        baseUrl: 'http://localhost:5000',
        url: '/search.htm',
        qs: {
          tbm: 'isch',
          gws_rd: 'cr', //get rid of our request being redirected by country
          q: query + ' site:' + scope
        },
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0'
        }
      })
      this.body = searchResults2json(searchResponse.body, scope)
    } catch (err) {
      console.error(err)
      this.status = 500
      this.body = {
        err: err
      }
    }
  }
}

module.exports = controller
