import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, Redirect } from 'react-router'

import Application from './components/Application';
import ImageList from './components/ImageList';
import ImageView from './components/ImageView';
import FrontPage from './components/FrontPage';

/*

-- Polyfills --

Object.assign polyfill
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
*/
if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

// IE 11 backwards compatibility, Promise and Fetch
import 'whatwg-fetch';
import Promise from 'promise-polyfill';

if (!window.Promise) {
	window.Promise = Promise;
}

var ReactGA = require('react-ga');
ReactGA.initialize('UA-99610642-1');

function logPageView() {
	ReactGA.set({
		page: window.location.pathname + window.location.search
	});
	ReactGA.pageview(window.location.pathname + window.location.search);
}

/*

React Router directs the application to right routes based on the url and url parameters.
The main routes are:

- Front page
- Search results
- Single image view

*/
ReactDOM.render(
	<Router history={hashHistory} onUpdate={logPageView}>

		<Redirect from="/" to="/search" />

		<Route path="/" component={Application}>
			<Route path="/search(/query/:search)(/person/:searchperson)(/tags(/person/:person)(/place/:place)(/museum/:museum)(/genre/:genre)(/tags/:tags)(/type/:type))" 
				component={FrontPage}/>
			<Route path="/image/:imageId(/display/:display)" 
				component={ImageView}/>
		</Route>

	</Router>,
	document.getElementById('app')
);