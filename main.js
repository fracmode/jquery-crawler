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
	window.crawl_results = null;

	$(document).ready( function() {
		var $el_region = $('.region-main');

		var baseurl = 'http://yahoo.co.jp';

		window.crawl_results = {};
		for ( i = 2; i <= 72; i++ ) {
		// for ( i = 2; i <= 3; i++ ) {
			( function() {
				var page_no = i;
				setTimeout( function() {
					console.log( page_no );
					$.ajax( {
						type: 'GET',
						url: baseurl + 'index_' + page_no + '.html',
						success: function( html_response ) {
							var links = [];
							$( html_response ).find( 'ul#tile li.entries__item' ).each( function() {
								links.push( $(this).find('a.entries__link').attr('href') );
							} );
							window.crawl_results[ page_no ] = links;
							// var ret = getURLsInBoxPro( $( html_response ), ( ( ( page_no - 1 ) * 20 ) + 1 ) );
							// console.log( ret );
							// $.each( ret, function() {
							// 	window.crawl_results[ this.index ] = this;
							// } );
							// console.log( window.crawl_results );
						}
					} );
				}, i * 1000 );
			} )();
		}
	} );
} )();

//
// 2. window.crawl_results のリストを元に顧客リストを作る
//
( function() {
	if ( typeof window.crawl_results === 'undefined' ) {
		return;
	}

	window.crawl_results_2 = {};

	var baseurl = 'http://yahoo.co.jp';

	var count = 1;
	$.each( window.crawl_results, function() {
		var item = this;
		count++;

		// console.log( this );

		( function() {
			var command_idx = count;
			setTimeout( function() {
				$.each( item, function() {
					var url_target = ( baseurl + this );
					$.ajax( {
						type: 'GET',
						url: url_target,
						success: function( html_response ) {
							window.crawl_results_2[ url_target ] = $( html_response ).find('.button--seconary[download]').attr('download');
							// console.log( $( html_response ).find('img.mfp-img').attr('src') )
							// var ret = getItemsInTable( $( html_response ), item );
							// console.log( ret );
							// window.crawl_results_2[ command_idx ] = ret;
						}
					} );
				} );
				// for ( _url in item ) {
				// 	var url_target = baseurl + '/' + _url;
				// 	console.log( command_idx, url_target );
				// }
			}, command_idx * 1000 );
		} )();
	} );
} )();

// 3
( function() {
	_text = []
	$.each( window.crawl_results_2, function() {
		_text.push( this );
	} );
	console.log( _text.join( "\n" ) );
	console.log( _text.length );
} )();
