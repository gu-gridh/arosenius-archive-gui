import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'

import Application from './components/Application';
import ImageList from './components/ImageList';
import ImageView from './components/ImageView';
import FrontPage from './components/FrontPage';

var ReactGA = require('react-ga');
ReactGA.initialize('UA-99610642-1');

function logPageView() {
	ReactGA.set({
		page: window.location.pathname + window.location.search
	});
	ReactGA.pageview(window.location.pathname + window.location.search);
}

ReactDOM.render(
	<Router history={hashHistory} onUpdate={logPageView}>
		<Route component={Application}>
			<Route path="/" 
				component={FrontPage}/>
			<Route path="/search(/query/:search)(/person/:person)(/persontag/:persontag)(/place/:place)(/museum/:museum)(/museumtag/:museumtag)(/genre/:genre)(/tags/:tags)(/type/:type)(/color/:hue/:saturation)" 
				component={FrontPage}/>
			<Route path="/image/:imageId(/search(/query/:search)(/person/:person)(/persontag/:persontag)(/place/:place)(/museum/:museum)(/genre/:genre)(/tags/:tags)(/type/:type)(/color/:hue/:saturation))" 
				component={ImageView}/>
		</Route>
	</Router>,
	document.getElementById('app')
);