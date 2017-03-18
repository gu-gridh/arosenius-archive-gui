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
			<Route path="/(search(/query/:search)(/person/:person))" component={FrontPage}/>
			<Route path="images" component={ImageList}/>
			<Route path="image/:imageId" component={ImageDisplay}/>
		</Route>
	</Router>,
	document.getElementById('app')
);