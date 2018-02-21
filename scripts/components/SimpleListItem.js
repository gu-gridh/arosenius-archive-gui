import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

import colorUtil from './../utils/colorUtil';

import config from './../config';

export default class SimpleListItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			image: this.props.image || null,
			index: this.props.index || 0
		};
	}

	componentWillReceiveProps(props) {
		this.setState({
			image: props.image || this.state.image,
			index: props.index || this.state.index || 0
		});
	}

	render() {
		var imageUrl = config.imageUrl+'255x/'+(this.state.image.images && this.state.image.images.length > 0 ? this.state.image.images[0].image : this.state.image.image ? this.state.image.image : '')+'.jpg';

		var dominantColor = this.state.image.images && this.state.image.images[0].googleVisionColors ? colorUtil.getDominantHex(this.state.image.images[0].googleVisionColors) : '#191919';

		return <a className="simple-item" key={this.state.image.id} href={'#image/'+this.state.image.id} >

			<div className="image-thumb" style={
				{
					backgroundColor: this.state.relativeSize ? dominantColor+'33' : dominantColor,
					backgroundImage: 'url("'+imageUrl+'")'
				}
			}>
			</div>

			<div className="item-info">
				{/*<div className="u-pull-right item-id">{this.state.image.insert_id}</div>*/}

				<div className="title">{this.state.image.title}
					{
						this.state.image.item_date_string &&
						<div className="year">{this.state.image.item_date_string}</div>
					}
				</div>

				<div className="item-meta">
					<div>Inventarie: {this.state.image.insert_id}</div>
					<div>Samling: {this.state.image.collection.museum}</div>
					<div>Kategori: {typeof this.state.image.type == 'string' ? this.state.image.type : this.state.image.type.join(', ')}</div>
					<div>{this.state.image.technique_material}</div>
				</div>

				<div className="u-cf" />
			</div>

		</a>;
	}
}
