import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

import config from './../config';

export default class ImageListItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			relativeSize: this.props.relativeSize || false,
			image: this.props.image || null,
			index: this.props.index || 0
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			relativeSize: props.relativeSize || this.state.relativeSize,
			image: props.image || this.state.image,
			index: props.index || this.state.index
		});
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
				'background-image': 'url("'+imageUrl+'")',
				width: this.state.image.size.inner.width*(imageWidth/this.props.maxWidth),
				height: this.state.image.size.inner.width*(imageHeight/this.props.maxWidth)
			};
		}
		else {
			imageStyle = {
				'background-image': 'url("'+imageUrl+'")',
				width: '100%',
				height: '100%'
			};
		}

		return imageStyle;
	}

	render() {
		var proxyImageStyle = this.getProxyImageStyle();

		console.log(proxyImageStyle);

		return <a style={{backgroundColor: this.state.image.images && this.state.image.images.length > 0 && this.state.image.images[0].color ? (this.state.relativeSize ? this.state.image.images[0].color.dominant.hex+'33' : this.state.image.images[0].color.dominant.hex) : '#333'}} 
			className="grid-item" 
			key={this.state.image.id} 
			href={'#image/'+this.state.image.id}
		>
			<div className="image-wrapper">
				<div className={'image-proxy'} style={proxyImageStyle} />
				<img ref="imageElement" style={{opacity: this.state.relativeSize ? 0 : 1, transitionDelay: (this.state.index/80)+'s'}} 
					src={config.imageUrl+'255x/'+(this.state.image.images && this.state.image.images.length > 0 ? this.state.image.images[0].image : this.state.image.image ? this.state.image.image : '')+'.jpg'} />
			</div>
			<div className="grid-title">{this.state.image.title}</div>
		</a>;
	}
}