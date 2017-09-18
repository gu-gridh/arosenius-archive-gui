import React from 'react';

import Search from './Search';
import ImageList from './ImageList';
import WindowScroll from './../utils/window-scroll';

export default class FrontPage extends React.Component {
	constructor(props) {
		super(props);

		this.arrowClick = this.arrowClick.bind(this);
		this.receivedSearchParamsHandler = this.receivedSearchParamsHandler.bind(this);

		window.eventBus.addEventListener('application.searchParams', this.receivedSearchParamsHandler);

		this.state = {
			searchParams: {},
			initialized: false,
			backgroundImage: null,
			backgroundLoaded: false
		};

		document.title = 'Ivar Aroseniusarkivet';
	}

	arrowClick() {
		(new WindowScroll()).scrollToY(document.documentElement.clientHeight-100, 1000, 'easeInOutSine');
	}

	receivedSearchParamsHandler(event, params) {
		this.setState({
			searchParams: params
		});
	}

	componentDidMount() {
		(new WindowScroll()).scrollToY(0, 1000, 'easeInOutSine');

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 200);

		this.loadBackgroundImage();
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

				<Search />

				<div className="site-content">
					<ImageList count="50" enableAutoLoad="true" searchString={this.state.searchParams.search} 
						searchPersons={this.state.searchParams.searchpersons && this.state.searchParams.searchpersons.length > 0 ? this.state.searchParams.searchpersons : this.state.searchParams.persons} 
						searchPlace={this.state.searchParams.place} 
						searchMuseum={this.state.searchParams.museum}
						searchGenre={this.state.searchParams.genre}
						searchTags={this.state.searchParams.tags}
						searchType={this.state.searchParams.type}
						searchHue={this.state.searchParams.hue}
						searchSaturation={this.state.searchParams.saturation} />
				</div>
			</div>
		)
	}
}