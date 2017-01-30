import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import Masonry  from 'react-masonry-component';

import ImageListCollection from '../collections/imagelistcollection';
import ImageListItem from './imagelistitem';

export default class ImageList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			images: []
		};

		this.collection = new ImageListCollection('http://cdh-vir-1.it.gu.se:8004/documents?page=1', function(json) {
			this.setState({
				images: json.documents
			})
		}.bind(this));

		this.collection.fetch();
	}

	componentDidMount() {

	}

	render() {
		var items = _.map(this.state.images, function(image) {
			return <ImageListItem key={image.id} image={image} />;
		});
		items.push(<div key="grid-sizer" className="grid-sizer"/>);

		var masonryOptions = {
			columnWidth: '.grid-sizer',
			percentPosition: true,
//			transitionDuration: 0
		};

		return <Masonry
				className={'grid'} // default ''
				options={masonryOptions} // default {}
				disableImagesLoaded={false} // default false
				updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
			>
			{items}
		</Masonry>;
	}
}