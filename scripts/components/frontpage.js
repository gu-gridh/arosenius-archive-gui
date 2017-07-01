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
			searchPersons: null,
			backgroundImage: null,
			backgroundLoaded: false
		};

		document.title = 'Ivar Aroseniusarkivet';
	}

	arrowClick() {
		(new WindowScroll()).scrollToY(document.documentElement.clientHeight-100, 1000, 'easeInOutSine');
	}

	componentDidMount() {
		(new WindowScroll()).scrollToY(0, 1000, 'easeInOutSine');

		setTimeout(function() {
			this.setState({
				initialized: true,
				searchString: this.props.params.search,
				searchPersons: this.props.params.person,
				searchPlace: this.props.params.place,
				searchMuseum: this.props.params.museum,
				searchGenre: this.props.params.genre,
				searchTags: this.props.params.tags,
				searchHue: this.props.params.hue,
				searchSaturation: this.props.params.saturation
			});
		}.bind(this), 200);

		this.loadBackgroundImage();
	}

	componentWillReceiveProps(props) {
		this.setState({
			searchString: props.params.search,
			searchPersons: props.params.person,
			searchPlace: props.params.place,
			searchMuseum: props.params.museum,
			searchGenre: props.params.genre,
			searchTags: props.params.tags,
			searchHue: props.params.hue,
			searchSaturation: props.params.saturation
		});
	}

	loadBackgroundImage() {
		var rand = Math.round(Math.random()*3)+1;
		var imageUrl = 'img/background/bg-'+rand+'.jpg';

		var image = new Image();

		image.onload = function() {
			this.setState({
				backgroundImage: imageUrl
			}, function() {
				setTimeout(function() {
					this.setState({
						backgroundLoaded: true
					});
				}.bind(this), 300);
			}.bind(this));
		}.bind(this);

		image.onerror = this.imageErrorHandler;

		image.src = imageUrl;
	}

	imageErrorHandler() {
	}

	render() {
		return (
			<div className={"front"+(this.state.initialized ? ' initialized' : '')}>
				<div className={'hero-image'+(this.state.backgroundLoaded ? ' initialized' : '')} style={{backgroundImage: 'url("'+this.state.backgroundImage+'")'}}>
					<div className="overlay"></div>

					<button className="arrow" onClick={this.arrowClick}></button>
				</div>

				<Search searchString={this.state.searchString} searchPersons={this.state.searchPersons} searchHue={this.state.searchHue} searchSaturation={this.state.searchSaturation} />

				<div className="site-content">
					<ImageList count="50" enableAutoLoad="true" searchString={this.state.searchString} 
						searchPerson={this.state.searchPersons} 
						searchPlace={this.state.searchPlace} 
						searchMuseum={this.state.searchMuseum}
						searchGenre={this.state.searchGenre}
						searchTags={this.state.searchTags}
						searchHue={this.state.searchHue}
						searchSaturation={this.state.searchSaturation} />
				</div>
			</div>
		)
	}
}