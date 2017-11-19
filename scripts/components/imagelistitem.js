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

	getImageStyle() {
		var imageUrl = config.imageUrl+'255x/'+(this.state.image.images && this.state.image.images.length > 0 ? this.state.image.images[0].image : this.state.image.image ? this.state.image.image : '')+'.jpg';
	
		if (this.state.relativeSize) {
			var imageWidth = this.refs.imageElement.clientWidth;
			var imageHeight = this.refs.imageElement.clientHeight;

			return {
				backgroundImage: 'url('+imageUrl+')',
				width: imageWidth/2,
				height: imageHeight/2
			};
		}
		else {
			return {
				backgroundImage: 'url('+imageUrl+')',
				width: '100%',
				height: '100%'
			};
		}
	}

	render() {
		return <a style={{backgroundColor: this.state.image.images && this.state.image.images.length > 0 && this.state.image.images[0].color ? this.state.image.images[0].color.dominant.hex : '#333'}} className="grid-item" key={this.state.image.id} href={'#image/'+this.state.image.id}>
			<div className="image-wrapper">
				<div className={'image-proxy'+(this.state.relativeSize ? ' visible' : '')} style={this.getImageStyle()} />
				<img ref="imageElement" style={{transitionDelay: (this.state.index/80)+'s'}} 
					src={config.imageUrl+'255x/'+(this.state.image.images && this.state.image.images.length > 0 ? this.state.image.images[0].image : this.state.image.image ? this.state.image.image : '')+'.jpg'} />
			</div>
			<div className="grid-title">{this.state.image.title}</div>
		</a>;
	}
}