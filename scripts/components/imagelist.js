import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import Masonry  from 'react-masonry-component';

import ImageListCollection from '../collections/ImageListCollection';
import ImageListItem from './ImageListItem';

export default class ImageList extends React.Component {
	constructor(props) {
		super(props);

		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);

		this.state = {
			images: [],
			initialized: false,
			columns: false
		};

		this.collection = new ImageListCollection('http://cdh-vir-1.it.gu.se:8004/documents', function(json) {
			this.setState({
				images: json.documents
			})
		}.bind(this));
	}

	componentDidMount() {
//		this.collection.fetch(this.props.searchString, this.props.searchPerson);
	}

	componentWillReceiveProps(props) {
		if (this.props.searchString != props.searchString || 
			this.props.searchPerson != props.searchPerson
		) {
			this.collection.fetch(props.searchString, props.searchPerson);
		}
	}

	imageLoadedHandler() {
		setTimeout(function() {
			if (!this.state.initialized) {
				console.log('setState?');
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

		if (this.props.columns || this.state.columns) {
			return <div className="grid grid-columns initialized">
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