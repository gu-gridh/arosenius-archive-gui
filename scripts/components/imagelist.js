import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import Masonry  from 'react-masonry-component';

import ImageListCollection from '../collections/ImageListCollection';
import ImageListItem from './ImageListItem';

import WindowScroll from './../utils/window-scroll';

export default class ImageList extends React.Component {
	constructor(props) {
		super(props);

		window.imageList = this;

		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);
		this.windowScrollHandler = this.windowScrollHandler.bind(this);

		this.state = {
			images: [],
			initialized: false,
			columns: false
		};

		this.collection = new ImageListCollection(function(event) {
			var imageArray = [];

			if (event.append) {
				var appendImageArray = _.filter(event.data.documents, function(document) {
					return (document.image && document.image != '') || (document.images && document.images.length > 0 && document.images[0].image != '');
				});

				imageArray = this.state.images.concat(appendImageArray);
			}
			else {
				imageArray = _.filter(event.data.documents, function(document) {
					return (document.image && document.image != '') || (document.images && document.images.length > 0 && document.images[0].image != '');
				});
			}
			this.setState({
				images: imageArray
			})
		}.bind(this));
	}

	componentDidMount() {
		if (this.props.enableAutoLoad) {
			window.addEventListener('scroll', this.windowScrollHandler)
		}
	}

	componentWillUnmount() {
		if (this.props.enableAutoLoad) {
			window.removeEventListener('scroll', this.windowScrollHandler);
		}
	}

	windowScrollHandler() {
		if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight-50) {
			if (this.props.enableAutoLoad) {
				this.appendPage();
			}
		}
	}

	componentWillReceiveProps(props) {
		if (props.related && props.relatedValue) {
			if (props.related == 'person') {
				this.collection.fetch({
					person: props.relatedValue
				}, props.count, 1);
			}
			if (props.related == 'museum') {
				this.collection.fetch({
					museum: props.relatedValue
				}, props.count, 1);
			}
			if (props.related == 'genre') {
				this.collection.fetch({
					genre: props.relatedValue
				}, props.count, 1);
			}
			if (props.related == 'tag') {
				this.collection.fetch({
					tags: props.relatedValue
				}, props.count, 1);
			}
		}
		else if (!props.searchString && !props.searchPerson && !props.searchPlace && !props.searchMuseum && !props.searchGenre && !props.searchTags && !props.searchHue && !props.searchSaturation && this.state.images.length == 0) {
			this.collection.fetch(null, props.count, 1);
		}
		else if (this.props.searchString != props.searchString || 
			this.props.searchPerson != props.searchPerson || 
			this.props.searchPlace != props.searchPlace || 
			this.props.searchMuseum != props.searchMuseum ||
			this.props.searchGenre != props.searchGenre ||
			this.props.searchTags != props.searchTags ||
			this.props.searchHue != props.searchHue ||
			this.props.searchSaturation != props.searchSaturation
		) {
			this.collection.fetch({
				searchString: props.searchString, 
				person: props.searchPerson, 
				place: props.searchPlace, 
				museum: props.searchMuseum, 
				genre: props.searchGenre, 
				tags: props.searchTags, 
				hue: props.searchHue, 
				saturation: props.searchSaturation
			}, props.count, 1);

			(new WindowScroll()).scrollToY(document.documentElement.clientHeight+200, 1000, 'easeInOutSine');
		}
	}

	appendPage() {
		this.collection.fetch({
			searchString: this.props.searchString, 
			person: this.props.searchPerson, 
			place: this.props.searchPlace, 
			museum: this.props.searchMuseum, 
			genre: this.props.searchGenre, 
			tags: this.props.searchTags, 
			hue: this.props.searchHue, 
			saturation: this.props.searchSaturation
		}, this.props.count, this.collection.currentPage+1, true);
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