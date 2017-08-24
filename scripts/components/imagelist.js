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
			columns: false,
			waitingForLoad: false
		};

		this.collection = new ImageListCollection(function(event) {
			this.waitingForLoad = false;

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
				images: imageArray,
				total: event.data.total
			})
		}.bind(this));
	}

	componentDidMount() {
		if (this.props.enableAutoLoad) {
			setTimeout(function() {
				window.addEventListener('scroll', this.windowScrollHandler)
			}.bind(this), 1000);
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

	getOffsetTop(elem) {
		var offsetTop = 0;
		do {
			if (!isNaN(elem.offsetTop )) {
				offsetTop += elem.offsetTop;
			}
		} while (elem = elem.offsetParent);

		return offsetTop;
	}

	componentWillReceiveProps(props) {
		if (props.related && props.relatedValue) {
			if (props.related == 'person') {
				this.collection.fetch({
					person: props.relatedValue
				}, props.count, 1, false, props.archiveMaterial || null);
			}
			if (props.related == 'museum') {
				this.collection.fetch({
					museum: props.relatedValue
				}, props.count, 1, false, props.archiveMaterial || null);
			}
			if (props.related == 'genre') {
				this.collection.fetch({
					genre: props.relatedValue
				}, props.count, 1, false, props.archiveMaterial || null);
			}
			if (props.related == 'tag') {
				this.collection.fetch({
					tags: props.relatedValue
				}, props.count, 1, false, props.archiveMaterial || null);
			}
		}
		else if (!props.searchString && !props.searchPerson && !props.searchPlace && !props.searchMuseum && !props.searchGenre && !props.searchTags && !props.searchHue && !props.searchSaturation && this.state.images.length == 0) {
			this.waitingForLoad = true;

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
			this.waitingForLoad = true;

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

			if (props.searchString || props.searchPerson || props.searchPlace || props.searchMuseum || props.searchGenre || props.searchTags || props.searchHue || props.searchSaturation) {
				(new WindowScroll()).scrollToY(this.getOffsetTop(this.refs.container)-50, 1000, 'easeInOutSine');
			}
		}
	}

	appendPage() {
		if (!this.waitingForLoad) {
			this.waitingForLoad = true;

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
			return <div ref="container">
				<div>
					{
						this.props.title && this.state.images.length > 0 &&
						<h3>{this.props.title}</h3>
					}
					{
						this.props.related && this.state.total > this.state.images.length &&
						<a className="view-more-link" href={'#/search/'+this.props.related+'/'+this.props.relatedValue}>Visa alla</a>
					}
				</div>

				<Masonry
					className={'grid'+(this.state.initialized ? ' initialized' : '')} // default ''
					options={masonryOptions} // default {}
					disableImagesLoaded={false} // default false
					updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
					onImagesLoaded={this.imageLoadedHandler}
					>
					{items}
				</Masonry>
			</div>;
		}
	}
}