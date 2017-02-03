import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import Masonry  from 'react-masonry-component';

import ImageListCollection from '../collections/imagelistcollection';
import ImageListItem from './imagelistitem';

export default class ImageList extends React.Component {
	constructor(props) {
		super(props);

		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);

		this.state = {
			images: [],
			initialized: false
		};

		this.collection = new ImageListCollection('http://cdh-vir-1.it.gu.se:8004/documents?page=1&museum=Nationalmuseum', function(json) {
			this.setState({
				images: json.documents
			})
		}.bind(this));

		this.collection.fetch();
	}

	imageLoadedHandler() {
		setTimeout(function() {
			if (!this.state.initialized) {			
				this.setState({
					initialized: true
				});
			}
		}.bind(this), 200);
	}

	render() {
		var items = _.map(this.state.images, function(image, index) {
			return <ImageListItem key={image.id} image={image} index={index} />;
		});
		items.push(<div key="grid-sizer" className="grid-sizer"/>);

		var masonryOptions = {
			columnWidth: '.grid-sizer',
			percentPosition: true,
			transitionDuration: 0
		};

		if (this.props.columns) {
			return <div className="grid columns">
				{items}
			</div>;
		}
		else {
			return <Masonry
					className={'grid'+(this.state.initialized ? ' initialized' : '')} // default ''
					options={masonryOptions} // default {}
					disableImagesLoaded={false} // default false
					updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
					onImagesLoaded={this.imageLoadedHandler}
				>
				{items}
			</Masonry>;
		}
	}
}