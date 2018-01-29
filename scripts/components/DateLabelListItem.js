import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

import config from './../config';

export default class DateLabelListItem extends React.Component {
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
		var date = this.state.image.item_date_string;

		var itemLabel = this.state.image.title;

		if (String(date).length > 4) {
			itemLabel = this.state.image.type+'<div class="smaller">'+date+'</div>';
		}

		return <a className="label-grid-item" key={this.state.image.id} href={'#image/'+this.state.image.id} style={{backgroundColor: this.state.image.images && this.state.image.images.length > 0 && this.state.image.images[0].color ? (this.state.relativeSize ? this.state.image.images[0].color.dominant.hex+'33' : this.state.image.images[0].color.dominant.hex) : '#333'}} >
			<div className="image-wrapper">
				<div className={'image-proxy'+(this.state.relativeSize ? ' visible' : '')} style={this.getImageStyle()} />
				<img ref="imageElement" style={{transitionDelay: (this.state.index/80)+'s'}}
					src={config.imageUrl+'255x/'+(this.state.image.images && this.state.image.images.length > 0 ? this.state.image.images[0].image : this.state.image.image ? this.state.image.image : '')+'.jpg'} />
			</div>
			<div className="label" dangerouslySetInnerHTML={{__html: itemLabel}}></div>
		</a>;
	}
}
