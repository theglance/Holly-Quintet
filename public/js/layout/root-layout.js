const RootLayout = Mn.LayoutView.extend({
  el: 'body',
  regions: {
    searchForm: '#search-form-region',
    searchResultsCovers: '#search-results-covers-region'
  }
})

module.exports = RootLayout
