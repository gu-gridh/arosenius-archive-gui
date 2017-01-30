import React from 'react';

import Header from './header';

export default class Application extends React.Component {
	constructor(props) {
		super(props);

		window.app = this;
	}

	render() {
		return (
			<div>
				<Header routerPath={this.props.location.pathname} />
				<div className="site-content">
					{this.props.children}
				</div>
			</div>
		)
	}
}