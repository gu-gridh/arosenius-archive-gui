import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'

import Application from './components/application';
import ImageList from './components/imagelist';
import ImageDisplay from './components/ImageDisplay';
import FrontPage from './components/frontpage';

ReactDOM.render(
	<Router history={hashHistory}>
		<Route component={Application}>
			<Route path="/(search(/query/:search)(/person/:person))" component={FrontPage}/>
//			<Route path="/search(/query/:search)(/person/:person)" component={FrontPage}/>
			<Route path="images" component={ImageList}/>
			<Route path="image/:imageId" component={ImageDisplay}/>
		</Route>
	</Router>,
	document.getElementById('app')
);