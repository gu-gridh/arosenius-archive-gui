import React from 'react';

export default class Application extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h1>This is the application</h1>
				<p><a href="#">Home</a> <a href="#images">Images</a></p>
				{this.props.children}
			</div>
		)
	}
}