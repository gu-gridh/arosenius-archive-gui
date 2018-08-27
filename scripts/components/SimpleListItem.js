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

	componentDidMount() {
		if (this.props.imageId) {
			this.fetchData(this.props.imageId);
		}
	}

	componentWillReceiveProps(props) {
		if (props.imageId && props.imageId != this.props.imageId) {
			this.fetchData(props.imageId);
		}
		else {
			this.setState({
				image: props.image || this.state.image,
				index: props.index || this.state.index || 0
			});
		}
	}

	fetchData(imageId) {
		fetch(config.apiUrl+config.endpoints.document+imageId)
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({
					image: json.data
				}, function() {
					this.forceUpdate();
				}.bind(this));
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	render() {
		if (!this.state.image) {
			return null;
		}

		var imageUrl = config.imageUrl+'255x/'+(this.state.image.images && this.state.image.images.length > 0 ? this.state.image.images[0].image : this.state.image.image ? this.state.image.image : '')+'.jpg';

		var dominantColor = this.state.image.images && this.state.image.images[0].googleVisionColors ? colorUtil.getDominantHex(this.state.image.images[0].googleVisionColors) : '#191919';

		return <a className="simple-list-item" key={this.state.image.id} href={'#image/'+this.state.image.id} >
			{
			/*
			<div className="detail-info row">
	
				<div className="image-thumb three columns">
					<img src={imageUrl} />
				</div>

				<div className="item-info nine columns">

					<div className="title">{this.state.image.title}
						{
							this.state.image.item_date_string &&
							<div className="year">{this.state.image.item_date_string}</div>
						}
					</div>

					<div className="item-meta">
						<div>Inventarie: {this.state.image.insert_id}</div>
						<div>{this.state.image.collection.museum}</div>
						<div>{typeof this.state.image.type == 'string' ? this.state.image.type : this.state.image.type.join(', ')}</div>
						<div>{this.state.image.technique_material}</div>
					</div>

					<div className="u-cf" />
				</div>
			</div>
			*/
			}

			<div className="image-thumb" style={
				{
					backgroundColor: dominantColor,
				}
			}>
				<img src={imageUrl} />
			</div>

			<div className="item-info">

				<div className="title">{this.state.image.title}
					{
						this.state.image.item_date_string &&
						<div className="year">{this.state.image.item_date_string}</div>
					}
				</div>

				<div className="item-meta">
					<div>Inventarie: {this.state.image.insert_id}</div>
					<div>{this.state.image.collection ? this.state.image.collection.museum : ''}</div>
					<div>{typeof this.state.image.type == 'string' ? this.state.image.type : _.compact(this.state.image.type).join(', ')}</div>
					<div>{this.state.image.technique_material}</div>
				</div>

				<div className="u-cf" />
			</div>

		</a>;
	}
}
