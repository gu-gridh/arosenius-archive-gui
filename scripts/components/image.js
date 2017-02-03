import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

import ImageList from './imagelist';
import WindowScroll from './../utils/window-scroll';

export default class Image extends React.Component {
	constructor(props) {
		super(props);

		this.toggleButtonClick = this.toggleButtonClick.bind(this);
		this.imageLoaded = this.imageLoaded.bind(this);
		this.windowScrollHandler = this.windowScrollHandler.bind(this);

		this.state = {
			image: null,
			showAll: true,
			initialized: false,
			fixedImageButtons: true
		};
	}

	fetchImage() {
		fetch('http://cdh-vir-1.it.gu.se:8004/document/'+this.props.params.imageId)
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({
					initialized: false,
					image: json.data
				});
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	toggleButtonClick() {
		this.setState({
			showAll: !this.state.showAll
		});

		setTimeout(function() {
			this.positionImageButtons();
		}.bind(this), 500);
	}

	windowScrollHandler() {
		this.positionImageButtons();
	}

	positionImageButtons() {
		var imageContainerHeight = this.refs.imageContainer.clientHeight;
		var windowHeight = document.documentElement.clientHeight;
		var scrollPos = window.scrollY;

		if (imageContainerHeight+100 <= windowHeight) {
			this.setState({
				fixedImageButtons: false
			});
		}
		else if (imageContainerHeight < windowHeight+scrollPos-100) {
			this.setState({
				fixedImageButtons: false
			});
		}
		else {
			this.setState({
				fixedImageButtons: true
			});
		}
	}

	imageLoaded() {
		this.setState({
			initialized: true
		});
	}

	componentDidMount() {
		this.fetchImage();

		window.addEventListener('scroll', this.windowScrollHandler);
	}

	componentDidUpdate(prevProps) {
		if (this.state.image.id != this.props.params.imageId) {
			this.fetchImage();
			
			new WindowScroll().scrollToY(0, 1000, 'easeInOutSine');
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.windowScrollHandler);
	}

	getBackgroundStyle() {
/*
		return this.state.image.color && this.state.image.color.colors ? {
			backgroundImage: 'linear-gradient(180deg,'+this.state.image.color.colors.prominent[0].hex+','+this.state.image.color.colors.prominent[1].hex+')'
		} : {};
		return this.state.image.color && this.state.image.color.colors ? {
			backgroundColor: this.state.image.color.colors.prominent[1].hex
		} : null;
*/
		return null;
	}

	render() {
		if (this.state.image) {		
			return <div>

				<div ref="imageContainer" style={this.getBackgroundStyle()} className={'image-display'+(this.state.showAll ? ' show-all' : '')+(this.state.initialized ? ' initialized' : '')}>
					<img onLoad={this.imageLoaded} src={'http://cdh-vir-1.it.gu.se:8004/images/1000x/'+this.state.image.image+'.jpg'} />

					<div ref="imageButtons" className={'image-buttons'+(this.state.fixedImageButtons ? ' fixed' : '')}>
						
						<button className="icon-plus"></button>

						<button className="toggle-show-all" onClick={this.toggleButtonClick}>
							<span className="icon-arrow arrow-1"></span>
							<span className="icon-arrow arrow-2"></span>
							Show all
						</button>

					</div>
				</div>

				<div className="container">

					<h2>{this.state.image.title}</h2>

					<div className="row">
						<div className="three columns">
							{
								this.state.image.item_date &&
								<span><span className="label">Datering:</span> {this.state.image.item_date}</span>
							}
						</div>
						<div className="three columns">
							<span className="label">Plats:</span> {this.state.image.collection.museum}<br/>
							{
								this.state.image.size && this.state.image.size.inner &&
								<span><span className="label">Mått:</span> {this.state.image.size.inner.height+'x'+this.state.image.size.inner.width} cm</span>
							}
						</div>
					</div>

					<br/>
					<p>{this.state.image.description}</p>

				</div>

				<ImageList />

			</div>;
		}
		else {
			return <div></div>;
		}
	}
}