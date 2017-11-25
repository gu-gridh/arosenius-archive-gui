	import React from 'react';
import { hashHistory } from 'react-router';

import 'whatwg-fetch';
import _ from 'underscore';

import ImageMap from './ImageMap';

import imageSizes from './../utils/imageSizes';

import config from './../config';

export default class ImageDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);
		this.windowScrollHandler = this.windowScrollHandler.bind(this);
		this.windowResizeHandler = this.windowResizeHandler.bind(this);
		this.imageDisplayClickHandler = this.imageDisplayClickHandler.bind(this);
		this.toggleFullDisplay = this.toggleFullDisplay.bind(this);
		this.toggleEnlargedDisplay = this.toggleEnlargedDisplay.bind(this);
		this.rotateButtonClickHandler = this.rotateButtonClickHandler.bind(this);

		this.state = {
			image: null,
			imageUrl: '',
			flipped: false,
			rotation: 0,
			enlargedDisplay: false
		};
	}

	toggleFullDisplay() {
		if (!this.props.pathname.match('/display/full')) {
			hashHistory.push(this.props.pathname+'/display/full');
		}
		else {
			hashHistory.push(this.props.pathname.replace('/display/full', ''));
		}
	}

	toggleEnlargedDisplay() {
		this.setState({
			enlargedDisplay: !this.state.enlargedDisplay
		});
	}

	checkFullDisplay() {
		setTimeout(function() {
			this.positionImageButtons();
		}.bind(this), 500);
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

			this.setState({
				lowresImageUrl: config.imageUrl+'255x/'+this.state.image.front.image+'.jpg'
			});

			image.onload = this.imageLoadedHandler;
			image.onerror = this.imageErrorHandler;
			image.src = config.imageUrl+imageSizes.getImageUrl()+'x/'+this.state.image.front.image+'.jpg';

			this.setState
		}
	}

	imageLoadedHandler() {
		var imageUrl = config.imageUrl+imageSizes.getImageUrl()+'x/'+this.state.image.front.image+'.jpg';

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
			image: this.props.image,
			fullDisplay: this.props.params && this.props.params.fullDisplay
		}, function() {
			this.loadImage();
		}.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.windowScrollHandler);
		window.removeEventListener('resize', this.windowResizeHandler);

		document.body.classList.remove('disable-scroll');
	}

	componentWillReceiveProps(props) {
		if ((props.image.front.image != this.state.image.front.image) || (props.fullDisplay != this.state.fullDisplay)) {
			// Check if component received new image object or just other params
			var imageChanged = props.image.front.image != this.state.image.front.image;

			this.setState({
				image: props.image,
				imageUrl: imageChanged ? '' : this.state.imageUrl, // only change this if component received new image object
				flipped: imageChanged ? false : this.state.flipped, // only change this if component received new image object
				rotation: 0,
				fullDisplay: props.fullDisplay
			}, function() {
				this.checkFullDisplay();

				// Load new image if component received new image object
				if (imageChanged) {
					this.loadImage();
				}
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
			backgroundImage: rearImage ? "url('"+config.imageUrl+imageSizes.getImageUrl()+"x/"+imgObj.image+".jpg')" : this.state.imageUrl && this.state.imageUrl != '' ? "url('"+this.state.imageUrl+"')" : null,

			width: imageWidth,
			height: imageHeight
		} : null;

		return imageStyle;
	}

	getImageStyle(rearImage) {
		var rotatedFrame = Boolean(Math.round(this.state.rotation/100) % 2);

		var imgObj = this.getImageObj(rearImage);

		var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)-90;

		var ratio = 0;

		var imageWidth = imgObj.imagesize.width;
		var imageHeight = imgObj.imagesize.height;

		if (this.state.enlargedDisplay) {
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
			backgroundImage: rearImage ? "url('"+config.imageUrl+imageSizes.getImageUrl()+"x/"+imgObj.image+".jpg')" : this.state.imageUrl && this.state.imageUrl != '' ? "url('"+this.state.imageUrl+"')" : "url('"+this.state.lowresImageUrl+"')",
//			opacity: !this.state.imageUrl && this.state.lowresImageUrl ? 0.2 : 1,
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

			return <div ref="imageContainer" className={'image-container'+(this.state.enlargedDisplay ? ' enlarged-display' : '')+(this.state.flippable ? ' flippable' : '')+(this.state.flipped ? ' flipped' : '')+(this.state.imageUrl && this.state.imageUrl != '' ? ' initialized' : '')}>

				<div className="image-wrapper" style={{transform: 'rotate('+this.state.rotation+'deg)'}}>

					<div className="image-display" onClick={this.imageDisplayClickHandler} style={this.getImageStyle()}>
						<div className="loader" style={{backgroundColor: this.getImageObj().color.dominant.hex}}></div>
					</div>

					{rearImageEl}

				</div>

				{
					this.state.fullDisplay &&
					<ImageMap imageObj={this.getImageObj(this.state.flipped)} />
				}

				<div ref="imageButtons" className={'image-buttons'+(this.state.fixedImageButtons ? ' fixed' : '')}>
					
					{/*<button className="icon-plus" onClick={this.hideUiClick}></button>*/}

					<a className="icon-download" href={config.imageUrl+(this.state.flipped ? this.state.image.back.image : this.state.image.front.image)+'.jpg'} target="_blank" download></a>

					<a className="icon-rotate" onClick={this.rotateButtonClickHandler}></a>

					<button className="toggle-show-all" style={{transitionDelay: '60ms'}} onClick={this.toggleEnlargedDisplay}>
						<span className="icon-arrow arrow-1"></span>
						<span className="icon-arrow arrow-2"></span>
						Show all
					</button>

					<button className="icon-fulldisplay" onClick={this.toggleFullDisplay}></button>

				</div>
			</div>;
		}
		else {

			return <div />
		}
	}
}