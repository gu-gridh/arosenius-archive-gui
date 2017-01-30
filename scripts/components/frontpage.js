import React from 'react';

import Search from './search';
import ImageList from './imagelist';
import WindowScroll from './../utils/window-scroll';

export default class FrontPage extends React.Component {
	constructor(props) {
		super(props);

		this.arrowClick = this.arrowClick.bind(this);

		this.state = {
			initialized: false
		};
	}

	arrowClick() {
		var scroll = new WindowScroll();

		scroll.scrollToY(document.documentElement.clientHeight-100, 1000, 'easeInOutSine');
	}

	componentDidMount() {
		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 200);
	}

	render() {
		return (
			<div className={"front"+(this.state.initialized ? ' initialized' : '')}>
				<div className="hero-image">
					<div className="overlay"></div>

					<button className="arrow" onClick={this.arrowClick}></button>
				</div>

				<Search />

				<div className="site-content">
					<ImageList />
				</div>
			</div>
		)
	}
}