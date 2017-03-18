import React from 'react';

import Header from './Header';

export default class Application extends React.Component {
	constructor(props) {
		super(props);

		this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

		this.state = {
			noUiDistract: false
		};

		window.app = this;
	}

	mouseMoveHandler() {
		document.body.classList.remove('hide-ui');
	}

	componentDidMount() {

	}

	render() {
		return (
			<div onMouseMove={this.mouseMoveHandler} className={this.state.noUiDistract ? 'hide-ui' : ''}>
				<Header routerPath={this.props.location.pathname} />
				<div className="site-content">
					{this.props.children}
				</div>
			</div>
		)
	}
}