import React from 'react';
import ThumbnailCircles from './thumbnail-circles';

export default class Search extends React.Component {
	constructor(props) {
		super(props);

		this.toggleButtonClick = this.toggleButtonClick.bind(this);

		this.state = {
			open: false
		};
	}

	toggleButtonClick() {
		this.setState({
			open: !this.state.open
		});
	}

	render() {
		return (
			<div className="search-module">

				<button className="toggle-search-button" onClick={this.toggleButtonClick}>Search</button>

				<div className={"module-content"+(this.state.open ? ' open' : '')}>
					<input type="text" placeholder="Skriv här..." className="search-input" />

					<ThumbnailCircles />
				</div>

			</div>
		)
	}
}