import React from 'react';

import Search from './Search';
import ImageList from './ImageList';
import WindowScroll from './../utils/window-scroll';

export default class FrontPage extends React.Component {
	constructor(props) {
		super(props);

		this.arrowClick = this.arrowClick.bind(this);

		this.state = {
			initialized: false,
			searchString: null,
			searchPerson: null
		};
	}

	arrowClick() {
		var scroll = new WindowScroll();

		scroll.scrollToY(document.documentElement.clientHeight-100, 1000, 'easeInOutSine');
	}

	componentDidMount() {
		setTimeout(function() {
			this.setState({
				initialized: true,
				searchString: this.props.params.search,
				searchPerson: this.props.params.person,
				searchMuseum: this.props.params.museum,
				searchHue: this.props.params.hue,
				searchSaturation: this.props.params.saturation
			});
		}.bind(this), 200);
	}

	componentWillReceiveProps(props) {
		console.log('FrontPage: componentWillReceiveProps');
		console.log(props);

		this.setState({
			searchString: props.params.search,
			searchPerson: props.params.person,
			searchMuseum: props.params.museum,
			searchHue: props.params.hue,
			searchSaturation: props.params.saturation
		});
	}

	render() {
		return (
			<div className={"front"+(this.state.initialized ? ' initialized' : '')}>
				<div className="hero-image">
					<div className="overlay"></div>

					<button className="arrow" onClick={this.arrowClick}></button>
				</div>

				<Search searchString={this.state.searchString} searchPerson={this.state.searchPerson} />

				<div className="site-content">
					<ImageList searchString={this.state.searchString} 
						searchPerson={this.state.searchPerson} 
						searchMuseum={this.state.searchMuseum}
						searchHue={this.state.searchHue}
						searchSaturation={this.state.searchSaturation} />
				</div>
			</div>
		)
	}
}