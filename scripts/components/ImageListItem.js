import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

import colorUtil from './../utils/colorUtil';
import chroma from 'chroma-js';

import config from './../config';

export default class ImageListItem extends React.Component {
	constructor(props) {
		super(props);

		this.imageLoadHandler = this.imageLoadHandler.bind(this);

		this.state = {
			relativeSize: this.props.relativeSize,
			image: this.props.image || null,
			index: this.props.index || 0
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			relativeSize: props.relativeSize,
			image: props.image || this.state.image,
			index: props.index || this.state.index || 0
		});
	}

	imageLoadHandler() {
		this.forceUpdate();
	}

	getProxyImageStyle() {
		if (!this.refs.imageElement) {
			return;
		}

		var imageUrl = config.imageUrl+'255x/'+(this.state.image.images && this.state.image.images.length > 0 ? this.state.image.images[0].image : this.state.image.image ? this.state.image.image : '')+'.jpg';
	
		var imageStyle = {};

		if (this.state.relativeSize && this.state.image.size && this.state.image.size.inner) {
			var imageWidth = this.refs.imageElement.clientWidth;
			var imageHeight = this.refs.imageElement.clientHeight;

			imageStyle = {
				backgroundImage: 'url("'+imageUrl+'")',
				width: this.state.image.size.inner.width*(imageWidth/this.props.maxWidth),
				height: this.state.image.size.inner.width*(imageHeight/this.props.maxWidth),
//				transitionDelay: (this.state.index/80)+'s'
			};
		}
		else {
			imageStyle = {
				backgroundImage: 'url("'+imageUrl+'")',
				width: '100%',
				height: '100%',
//				transitionDelay: (this.state.index/80)+'s'
			};
		}

		return imageStyle;
	}

	render() {
		var proxyImageStyle = this.getProxyImageStyle();

		var dominantColor = this.state.image.images && this.state.image.images[0].googleVisionColors ? colorUtil.getDominantHex(this.state.image.images[0].googleVisionColors) : '#191919';

		if (this.props.showColors) {
			var colorElements = this.state.image.images && this.state.image.images[0].googleVisionColors ? this.state.image.images[0].googleVisionColors.map(function(color, index) {
				return <span key={index} style={{display: 'block', float: 'left', height: 10, width: (color.score*100)+'%', backgroundColor: chroma(color.color.red, color.color.green, color.color.blue).hex()}}></span>;
			}) : [];
		}

		return <a style={{backgroundColor: dominantColor}} 
			className="grid-item" 
			key={this.state.image.id} 
			href={'#image/'+this.state.image.id}
		>
			<div className="image-wrapper">
				<div className={'image-proxy'} style={proxyImageStyle} />
				<img ref="imageElement" 
					onLoad={this.imageLoadHandler}
					style={{transitionDelay: (this.state.index/80)+'s'}} 
					src={config.imageUrl+'255x/'+(this.state.image.images && this.state.image.images.length > 0 ? this.state.image.images[0].image : this.state.image.image ? this.state.image.image : '')+'.jpg'} />
			</div>
			<div className="grid-title">
				{this.state.image.title}
				{
					this.props.showDates &&
					<div className="smaller">{this.state.image.item_date_string}</div>
				}
				{
					this.props.showColors &&
					<div style={{padding: 5, background: '#000', height: 20, boxSizing: 'border-box'}} className="colors">{colorElements}</div>
				}
			</div>
		</a>;
	}
}