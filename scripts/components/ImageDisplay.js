import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

import ImageMap from './ImageMap';

import config from './../config';

export default class ImageDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);
		this.windowScrollHandler = this.windowScrollHandler.bind(this);
		this.windowResizeHandler = this.windowResizeHandler.bind(this);
		this.imageDisplayClickHandler = this.imageDisplayClickHandler.bind(this);
		this.toggleFullDisplay = this.toggleFullDisplay.bind(this);
		this.rotateButtonClickHandler = this.rotateButtonClickHandler.bind(this);

		this.state = {
			image: null,
			imageUrl: '',
			flipped: false,
			rotation: 0
		};
	}

	toggleFullDisplay() {
		this.setState({
			fullDisplay: !this.state.fullDisplay
		}, function() {
			if (this.state.fullDisplay) {
				document.body.classList.add('hide-scroll');
			}
			else {
				document.body.classList.remove('hide-scroll');
			}
			setTimeout(function() {
				this.positionImageButtons();
			}.bind(this), 500);
		}.bind(this));
	}

	imageDisplayClickHandler() {
		if (this.state.image.back) {
			this.setState({
				flipped: !this.state.flipped
			});
		}
	}

	rotateButtonClickHandler() {
		this.setState({
			rotation: this.state.rotation+90
		});
	}

	windowResizeHandler() {
		this.positionImageButtons();
	}

	windowScrollHandler() {
		this.positionImageButtons();
	}

	mouseMoveHandler() {
		if (this.mouseIdleTimer) {
			clearTimeout(this.mouseIdleTimer);
		}
		this.mouseIdleTimer = setTimeout(this.mouseIdleHandler.bind(this), 2000);
	}

	mouseIdleHandler() {
//		document.body.classList.add('hide-ui');
	}

	positionImageButtons() {
		if (this.refs.imageContainer) {		
			var imageContainerHeight = this.refs.imageContainer.clientHeight;
			var windowHeight = document.documentElement.clientHeight;
			var scrollPos = window.scrollY;

			if (imageContainerHeight+80 <= windowHeight) {
				this.setState({
					fixedImageButtons: false
				});
			}
			else if (imageContainerHeight < windowHeight+scrollPos-80) {
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
	}

	loadImage() {
		if (this.state.image) {
			var image = new Image();

			image.onload = this.imageLoadedHandler;
			image.onerror = this.imageErrorHandler;
			image.src = config.imageUrl+'1000x/'+this.state.image.front.image+'.jpg';
		}
	}

	imageLoadedHandler() {
		var imageUrl = config.imageUrl+'1000x/'+this.state.image.front.image+'.jpg';

		this.setState({
			imageUrl: imageUrl,
			flippable: Boolean(this.state.image.back),
			flipped: false,
			rotation: 0
		});

		setTimeout(function() {
			this.positionImageButtons();
		}.bind(this), 100);
	}

	imageErrorHandler(event) {
	}

	componentDidMount() {
		window.addEventListener('scroll', this.windowScrollHandler);
		window.addEventListener('resize', this.windowResizeHandler);

		this.setState({
			image: this.props.image
		}, function() {
			this.loadImage();
		}.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.windowScrollHandler);
		window.removeEventListener('resize', this.windowResizeHandler);

		document.body.classList.remove('hide-scroll');
	}

	componentWillReceiveProps(props) {
		if (props.image.front.image != this.state.image.front.image) {
			document.body.classList.remove('hide-scroll');

			this.setState({
				image: props.image,
				imageUrl: '',
				flipped: false,
				rotation: 0,
				fullDisplay: false
			}, function() {
				this.loadImage();
			}.bind(this));
		}
	}

	getImageObj(rearImage) {
		var imgObj;

		if (rearImage) {
			imgObj = this.state.image.back;
		}
		else {
			imgObj = this.state.image.front;
		}
		return imgObj;
	}

	_getImageStyle(rearImage) {
		var rotatedFrame = Boolean(Math.round(this.state.rotation/100) % 2);

		var imgObj = this.getImageObj(rearImage);

		var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var ratio = 0;

		var imageWidth = imgObj.imagesize.width;
		var imageHeight = imgObj.imagesize.height;

		if (this.state.fullDisplay) {
			var calcViewWidth = viewWidth;
			var calcImageWidth = imageWidth;
			var calcImageHeight = imageHeight;

			ratio = calcViewWidth / calcImageWidth;
			imageWidth = calcViewWidth;
			imageHeight = calcImageHeight * ratio;
		}
		else {
			if (imageWidth > viewWidth){
				ratio = viewWidth / imageWidth;
				imageWidth = viewWidth;
				imageHeight = imageHeight * ratio;
			}

			if (imageHeight > viewHeight){
				ratio = viewHeight / imageHeight;
				imageHeight = viewHeight;
				imageWidth = imageWidth * ratio;
			}
		}

		var imageStyle = imgObj.color && imgObj.color.colors ? {
			backgroundColor: imgObj.color.dominant.hex,
			backgroundImage: rearImage ? "url('"+config.imageUrl+"1000x/"+imgObj.image+".jpg')" : this.state.imageUrl && this.state.imageUrl != '' ? "url('"+this.state.imageUrl+"')" : null,

			width: imageWidth,
			height: imageHeight
		} : null;

		return imageStyle;
	}

	getImageStyle(rearImage) {
		var rotatedFrame = Boolean(Math.round(this.state.rotation/100) % 2);

		var imgObj = this.getImageObj(rearImage);

		var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var ratio = 0;

		var imageWidth = imgObj.imagesize.width;
		var imageHeight = imgObj.imagesize.height;

		if (imageWidth > viewWidth){
			ratio = viewWidth / imageWidth;
			imageWidth = viewWidth;
			imageHeight = imageHeight * ratio;
		}

		if (imageHeight > viewHeight){
			ratio = viewHeight / imageHeight;
			imageHeight = viewHeight;
			imageWidth = imageWidth * ratio;
		}

		var imageStyle = imgObj.color && imgObj.color.colors ? {
			backgroundColor: imgObj.color.dominant.hex,
			backgroundImage: rearImage ? "url('"+config.imageUrl+"1000x/"+imgObj.image+".jpg')" : this.state.imageUrl && this.state.imageUrl != '' ? "url('"+this.state.imageUrl+"')" : null,

			width: imageWidth,
			height: imageHeight
		} : null;

		return imageStyle;
	}

	render() {
		if (this.state.image) {
			var rearImageEl;
			if (this.state.image.back) {
				rearImageEl = <div className="image-display image-rear" onClick={this.imageDisplayClickHandler} style={this.getImageStyle(true)}></div>;
			}

			return <div ref="imageContainer" className={'image-container'+(this.state.fullDisplay ? ' full-display' : '')+(this.state.flippable ? ' flippable' : '')+(this.state.flipped ? ' flipped' : '')+(this.state.imageUrl && this.state.imageUrl != '' ? ' initialized' : '')}>

				<div className="image-wrapper" style={{transform: 'rotate('+this.state.rotation+'deg)'}}>

					<div className="image-display" onClick={this.imageDisplayClickHandler} style={this.getImageStyle()}>
						<div className="loader"></div>
					</div>

					{rearImageEl}

				</div>

				{
					this.state.fullDisplay &&
					<ImageMap imageObj={this.getImageObj(this.state.flipped)} />
				}

				<div ref="imageButtons" className={'image-buttons'+(this.state.fixedImageButtons || this.state.fullDisplay ? ' fixed' : '')}>
					
					{/*<button className="icon-plus" onClick={this.hideUiClick}></button>*/}

					<a className="icon-download" href={config.imageUrl+(this.state.flipped ? this.state.image.back.image : this.state.image.front.image)+'.jpg'} target="_blank"></a>

					<a className="icon-rotate" onClick={this.rotateButtonClickHandler}></a>

					{/*<button className="icon-plus"></button>*/}

					<button className="toggle-show-all" style={{transitionDelay: '60ms'}} onClick={this.toggleFullDisplay}>
						<span className="icon-arrow arrow-1"></span>
						<span className="icon-arrow arrow-2"></span>
						Show all
					</button>

				</div>
			</div>;
		}
		else {

			return <div />
		}
	}
}