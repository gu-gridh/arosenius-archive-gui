import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'

import Application from './components/Application';
import ImageList from './components/ImageList';
import ImageDisplay from './components/ImageDisplay';
import FrontPage from './components/FrontPage';

ReactDOM.render(
	<Router history={hashHistory}>
		<Route component={Application}>
			<Route path="/(search(/query/:search)(/person/:person)(/place/:place)(/museum/:museum)(/genre/:genre)(/tags/:tags)(/color/:hue/:saturation))" component={FrontPage}/>
			<Route path="/images" component={ImageList}/>
			<Route path="/image/:imageId(/search(/query/:search)(/person/:person)(/place/:place)(/museum/:museum)(/genre/:genre)(/tags/:tags)(/color/:hue/:saturation))" component={ImageDisplay}/>
		</Route>
	</Router>,
	document.getElementById('app')
);