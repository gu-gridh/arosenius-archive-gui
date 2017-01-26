import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'

import Application from './components/application';
import ImageList from './components/imagelist';
import Image from './components/image';

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={Application}>
			<Route path="images" component={ImageList}/>
			<Route path="image/:imageId" component={Image}/>
		</Route>
	</Router>,
	document.getElementById('app')
);