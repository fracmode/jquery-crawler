/*!
 * jQuery Crawler for TorBrowser (Firefox) Console v0.0.1
 * https://github.com/fracmode/jquery-crawler-for-torbrowser
 *
 * Date: 2015-10-16
 */

// 1. copy and paste this line to TorBrowser JavaScript Console
//
document.body.appendChild(function(){src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js";sc = document.createElement("script");sc.type="text/javascript";sc.src=src;sc.onload = function() {/*window.jQuery.noConflict();*/};return sc;}());

// 2. paste these line to Console to get URL List
//    *** URL is dummy and not working for now ***
( function() {
	window.jQTB = { result: null };

	$(document).ready( function() {
		var params = {
			baseurl: 'http://image.search.yahoo.co.jp/search?ei=UTF-8&fr=top_ga1_sa&p=%E7%8C%AB',
			el: {
				link: '#gridlist .tb a',
				next: '#Sp1.mod .m a'
			},
			limit: 10,
			callbackModUrl: function( url ) {
				url = url.substr( url.indexOf('**') + 2 );
				return decodeURIComponent( url );
			}
		};

		window.jQTB.result = [];
		( function() {
			// get links in target element
			var findLinks = function( $el_target ) {
				var $el_links = $el_target.find( params.el.link );
				if ( $el_links.length <= 0 ) {
					return;
				}
				$el_links.each( function() {
					window.jQTB.result.push( $(this).attr('href') );
				} );
			};
			// get links and go next page recursively
			var callbackSuccess = function( $el_target, count ) {
				console.log( 'count', count );
				if ( count >= params.limit ) {
					return;
				}
				var $el_next = $el_target.find( params.el.next );
				if ( $el_next.length <= 0 ) { return; }

				findLinks( $el_target );

				var _url = $el_next.attr('href');
				if ( typeof params.callbackModUrl == 'function' ) {
					_url = params.callbackModUrl( _url );
				}
				console.log( '_url', _url );

				setTimeout( function() {
					$.ajax( {
						type: 'GET',
						url: _url,
						xhrFields: { withCredentials: true },
						success: function( response ) {
							callbackSuccess( $( response ), ++count );
						},
						error: function() {
							console.log( 'error', _url );
						}
					} );
				}, 1000 );
			};

			$.ajax( {
				type: 'GET',
				url: params.baseurl,
				xhrFields: { withCredentials: true },
				success: function( response ) {
					callbackSuccess( $( response ), 1 );
				},
				error: function() {
					console.log( 'error', params.baseurl );
				}
			} );

		} )();
	} );
} )();
