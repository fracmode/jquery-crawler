###
 * jQuery Crawler for TorBrowser (Firefox) Console v0.0.1
 *   https://github.com/fracmode/jquery-crawler-for-torbrowser
 * 
 * Date: 2015-10-16
###

'use strict'

###
 * 1. copy and paste this line to TorBrowser JavaScript Console
###
`document.body.appendChild(function(){src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js";sc = document.createElement("script");sc.type="text/javascript";sc.src=src;sc.onload = function() {/*window.jQuery.noConflict();*/};return sc;}())`

###
 * 2. paste these line to Console to get URL List
 *    *** URL is dummy and not working for now ***
 *
 * TODO:
 *   - crawling action should be rewritten using $.deferred 
###
do ->
	window.jQTB = result: null

	params = 
		baseurl: 'http://image.search.yahoo.co.jp/search?p=%E7%8C%AB&ei=UTF-8&save=0'
		el:
			link: '#gridlist .tb a'
			next: '#Sp1.mod .m a'
		limit: 10
		callbackModUrl: (url) ->
			url = url.substr(url.indexOf('**') + 2)
			decodeURIComponent url
	console.log 'params', params

	# __setTimeout
	__setTimeout = ( time = 1000, callback ) -> setTimeout( callback, time )

	# get links in target element
	findLinks = ($el_target) ->
		$el_links = $el_target.find(params.el.link)
		if $el_links.length <= 0
			return
		$el_links.each ->
			window.jQTB.result.push $(this).attr('href')
			return
		return

	# get links and go next page recursively
	callbackSuccess = ($el_target, count) ->
		console.log 'count', count, 'limit', params.limit
		if count >= params.limit
			console.log "crawling count is reached the limit. (#{ params.limit })"
			return
		$el_next = $el_target.find(params.el.next)
		if $el_next.length <= 0
			console.log "next link is not found. (element name: #{ params.el.next })"
			return

		findLinks $el_target

		_url = $el_next.attr('href')
		_url = params.callbackModUrl(_url) if ( typeof params.callbackModUrl is 'function' )
		__setTimeout 1000, ->
			$.ajax
				type: 'GET'
				url: _url
				xhrFields: withCredentials: true
				success: (response) ->
					callbackSuccess $(response), ++count
					return
				error: ->
					console.log 'error', _url
					return
			return

	window.jQTB.result = []

	$(document).ready ->
		do ->
			$.ajax
				type: 'GET'
				url: params.baseurl
				xhrFields: withCredentials: true
				success: (response) ->
					callbackSuccess $(response), 1
				error: ->
					console.log 'error', params.baseurl
