import React from 'react';

import WindowScroll from './../utils/window-scroll';

export default class FrontPage extends React.Component {
	constructor(props) {
		super(props);

		this.arrowClick = this.arrowClick.bind(this);
		this.receivedSearchParamsHandler = this.receivedSearchParamsHandler.bind(this);

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
//		(new WindowScroll()).scrollToY(0, 1000, 'easeInOutSine');

		this.setState({
			searchParams: this.props.params
		});

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 200);

		this.loadBackgroundImage();

//		window.eventBus.addEventListener('application.searchParams', this.receivedSearchParamsHandler);
	}

	componentWillReceiveProps(props) {
		this.setState({
			searchParams: props.params
		});
	}

	loadBackgroundImage() {
		var rand = Math.floor(Math.random()*14)+1;
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

					<button style={{display: 'none'}} className="arrow" onClick={this.arrowClick}></button>
				</div>

			</div>
		)
	}
}