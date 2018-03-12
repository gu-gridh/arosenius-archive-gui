import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, Redirect } from 'react-router'

import Application from './components/Application';
import GoogleVisionLabelsViewer from './components/GoogleVisionLabelsViewer';
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

		<Redirect from="/" to="/search" />

		<Route path="/" component={Application}>
			<Route path="/search(/query/:search)(/person/:searchperson)(/color/:hue/:saturation)(/tags(/person/:person)(/place/:place)(/museum/:museum)(/genre/:genre)(/tags/:tags)(/type/:type))" 
				component={FrontPage}/>
			<Route path="/image/:imageId(/display/:display)" 
				component={ImageView}/>
		</Route>

		<Route path="/googleVisionLabels" component={GoogleVisionLabelsViewer} />

	</Router>,
	document.getElementById('app')
);