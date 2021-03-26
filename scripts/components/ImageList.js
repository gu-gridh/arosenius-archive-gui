import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import Masonry  from 'react-masonry-component';

import ImageListCollection from '../collections/ImageListCollection';

import ImageListItem from './ImageListItem';
import SimpleListItem from './SimpleListItem';

import WindowScroll from './../utils/window-scroll';

export default class ImageList extends React.Component {
	constructor(props) {
		super(props);

		window.imageList = this;

		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);
		this.windowScrollHandler = this.windowScrollHandler.bind(this);

		this.masonryOptions = {
			columnWidth: '.grid-sizer',
			percentPosition: true,
			transitionDuration: 0,
			animationOptions: {
				duration: 500,
				queue: false
			},
			isAnimated: false
		};

		this.state = {
			images: [],
			loading: false,
			initialized: false,
			columns: false,
			waitingForLoad: false,
			relativeSizes: false
		};

		this.collection = new ImageListCollection(function(event) {
			setTimeout(function() {
				this.waitingForLoad = false;
			}.bind(this), 500);

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
				total: event.data.total,
				loading: false
			});
		}.bind(this), function(event) {
			this.setState({
				loading: false
			});
		}.bind(this));
	}

	componentDidMount() {
		if (this.props.enableAutoLoad || this.props.lazyLoad) {
			setTimeout(function() {
				window.addEventListener('scroll', this.windowScrollHandler);
			}.bind(this), 500);
		}

		if (!this.props.lazyLoad) {
			this.handleProps(this.props);
		}

		setTimeout(function() {
			this.positionButtons();
		}.bind(this), 500);
	}

	componentWillUnmount() {
		if (this.props.enableAutoLoad || this.props.lazyLoad) {
			window.removeEventListener('scroll', this.windowScrollHandler);
		}
	}

	positionButtons() {
		if (this.props.listType != 'date-labels' && this.refs.container) {
			var containerTop = this.refs.container.getBoundingClientRect().top;
			var windowHeight = document.documentElement.clientHeight;

			this.setState({
				fixedButtons: windowHeight<(containerTop+85)
			});
		}
	}

	isInViewport(el) {
		var rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
			rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
		);
	}

	windowScrollHandler() {
		if (this.props.enableAutoLoad) {
			if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight-50) {
				this.appendPage();
			}
		}

		if (this.props.lazyLoad && this.refs.container) {
			if (this.isInViewport(this.refs.container) && this.state.images.length == 0) {
				setTimeout(function() {
					if (this.isInViewport(this.refs.container) && this.state.images.length == 0) {
						this.handleProps(this.props);
					}
				}.bind(this), 500);
			}
		}

		this.positionButtons();
	}

	componentWillReceiveProps(props) {
		if (!this.props.lazyLoad || (this.isInViewport(this.refs.container)) || (!this.isInViewport(this.refs.container) && this.props.forceUpdate && this.state.initialized)) {
			this.handleProps(props);
		}
	}

	fetchData(params, count, page, append, archiveMaterial) {
		this.collection.fetch(params, count, page, append, archiveMaterial)
	}

	handleProps(props) {
		if (props.related && props.relatedValue) {
			var tagType = props.related === 'tag' ? 'tags' : props.related
			var params = { [tagType]: props.relatedValue }
			if (props.sort) {
				params.sort = props.sort
			}
			this.fetchData(params, props.count, 1, false, props.archiveMaterial || null);
		}
		else if (props.nearestNeighbors) {
			this.fetchNearestNeighbors();
		}
		else if (!props.year && !props.searchString && !props.searchPerson && !props.searchPlace && !props.searchMuseum && !props.searchGenre && !props.searchTags && !props.searchSeries && !props.searchType && this.state.images.length == 0) {
			this.waitingForLoad = true;

			var params;

			var state = {
				loading: true
			};

			if (props.listType == 'simple') {
				params = {
					sort: 'insert_id'
				};

				state.images = [];
			}

			this.setState(state);

			this.fetchData(params, props.count, 1, false, props.archiveMaterial || null);
		}
		else if (this.props.searchString != props.searchString ||
			this.props.searchPerson != props.searchPerson ||
			this.props.searchPlace != props.searchPlace ||
			this.props.searchMuseum != props.searchMuseum ||
			this.props.searchGenre != props.searchGenre ||
			this.props.searchTags != props.searchTags ||
			this.props.searchSeries != props.searchSeries ||
			this.props.searchType != props.searchType ||
			this.props.year != props.year ||
			this.state.images.length == 0
		) {
			this.waitingForLoad = true;

			var params = {
				searchString: props.searchString,
				person: props.searchPerson,
				place: props.searchPlace,
				museum: props.searchMuseum,
				genre: props.searchGenre,
				tags: props.searchTags,
				series: props.searchSeries,
				type: props.searchType,
				year: props.year
			};

			if (props.listType == 'simple') {
				params.sort = 'insert_id';
			}
			else if (params.series) {
				// When filtering by series, sort results by title.
				params.sort = 'title';
			}

			var state = {
				loading: true
			};

			if (this.props.listType != props.listType) {
				if (props.listType == 'simple') {
					params = {
						sort: 'insert_id'
					};
				}

				state.images = [];
			}

			this.setState(state);

			this.fetchData(params, props.count, 1, false, props.archiveMaterial || null);

			if ((props.searchString || props.searchPerson || props.searchPlace || props.searchMuseum || props.searchGenre || props.searchTags || props.searchSeries || props.searchType) && !this.props.lazyLoad && !this.props.disableScrolling) {
				var windowScroll = new WindowScroll();
				windowScroll.scrollToY(windowScroll.getOffsetTop(this.refs.container)-250, 1000, 'easeInOutSine');
			}
		}
		else if (this.props.listType != props.listType) {
			var params = {};

			if (props.listType == 'simple') {
				params.sort = 'insert_id';
			}
			this.fetchData(params, props.count, 1, false, props.archiveMaterial || null);
		}
	}

	appendPage() {
		if (!this.waitingForLoad) {
			this.waitingForLoad = true;

			var params = {
				searchString: this.props.searchString,
				person: this.props.searchPerson,
				place: this.props.searchPlace,
				museum: this.props.searchMuseum,
				genre: this.props.searchGenre,
				tags: this.props.searchTags,
				series: this.props.searchSeries,
				type: this.props.searchType
			};

			if (this.props.listType == 'simple') {
				params.sort = 'insert_id';
			}

			this.fetchData(params, this.props.count, this.collection.currentPage+1, true);
		}
	}

	fetchNearestNeighbors() {
		var nearestNeighborsUrl = 'nearest_neighbors/'+this.props.nearestNeighborsType+'/'+this.props.nearestNeighbors+'.json';

		console.log(nearestNeighborsUrl);

		fetch(nearestNeighborsUrl).then(function(response) {
			return response.json();
		}.bind(this)).then(function(json) {
			var ids = _.map(_.filter(json, function(item) {
				return item.similarity < 1;
			}), function(item) {
				return item.filename;
			});

			this.fetchData({
				ids: ids.join(';')
			});
		}.bind(this)).catch(function(ex) {
			console.log('parsing failed', ex)
		});
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
		var maxWidth = _.max(_.map(this.state.images, function(image) {
			return image && image.size && image.size.inner ? image.size.inner.width : 0;
		}));

		var items = [];

		_.each(this.state.images, function(image, index) {
			var item;

			if (this.props.listType == 'simple') {
				item = <SimpleListItem key={image.id} image={image} index={index} />
			}
			else {
				item = <ImageListItem
					showDates={this.props.showDates}
					key={image.id}
					image={image}
					index={index}
					relativeSize={this.state.relativeSizes}
					maxWidth={maxWidth} />;
			}

			items.push(item);

			if (this.props.listType == 'simple') {	
				if ((index+1) % 3 === 0) {
					items.push(<div key={'cf-3-'+index} className={'u-cf list-divider divider-3'} />);
				}
				if ((index+1) % 2 === 0) {
					items.push(<div key={'cf-2-'+index} className={'u-cf list-divider divider-2'} />);
				}
			}
		}.bind(this));

		window.imageListItems = items;

		if (items.length == 0 && !this.props.nearestNeighbors) {
			items.push(<h2 key="no-results" className="no-results">Inga sökträffar</h2>)
		}
		else {
			items.push(<div key="grid-sizer" className="grid-sizer"/>);
		}

		var masonryOptions = _.defaults({
			// If the items are in a certain order, applying horizontal order to the masonry will make it slightly more intuitive.
			horizontalOrder: !!this.props.searchSeries || this.props.related === 'series'
		}, this.masonryOptions)

		var listElement;
		if (this.props.listType == 'date-labels') {
/*
			listElement = <div className="image-label-list">
				{items}
			</div>;
*/
			listElement = <Masonry
				ref={this.masonryRef}
				className={'grid image-label-grid'+(this.state.initialized ? ' initialized' : '')} // default ''
				options={masonryOptions}
				disableImagesLoaded={false}
				updateOnEachImageLoad={true}
				onImagesLoaded={this.imageLoadedHandler}>
				{items}
			</Masonry>
		}
		else if (this.props.listType == 'simple') {
			listElement = <div className="simple-list">
				{items}
				<div className="u-cf" />
			</div>;
		}
		else {
			listElement = <Masonry
				ref={this.masonryRef}
				className={'grid image-grid'+(this.state.initialized ? ' initialized' : '')} // default ''
				options={masonryOptions}
				disableImagesLoaded={false}
				updateOnEachImageLoad={true}
				onImagesLoaded={this.imageLoadedHandler}>
				{items}
			</Masonry>
		}

		if (this.props.columns || this.state.columns) {
			return <div className="grid grid-columns initialized">
				{items}
			</div>;
		}
		else {
			return <div ref="container" data-title={this.props.title} className={'image-list'+(this.state.relativeSizes ? ' relative-sizes' : '')+(this.state.loading ? ' loading' : '')} style={this.state.images.length < 2 && this.props.related ? {display: 'none'} : null}>
				<div>
					{
						this.props.title && this.state.images.length > 0 &&
						<h3>{this.props.title}</h3>
					}
					{
						this.props.related && this.state.total > this.state.images.length &&
						<a className="view-more-link" href={'#/search/tags/'+this.props.related+'/'+this.props.relatedValue}>Visa alla</a>
					}
				</div>

				{
					this.state.images.length > 1 && (this.props.listType != 'date-labels' && this.props.listType != 'simple') &&
					<div className={'list-buttons'+(this.state.fixedButtons ? ' fixed' : '')}>
						<button className="circle-button icon-relative-sizes"
							onClick={function() {this.setState({relativeSizes: !this.state.relativeSizes})}.bind(this)}>
							<span className="icon-box box-1" />
							<span className="icon-box box-2" />
							<span className="icon-box box-3" />
							<span className="icon-box box-4" />
						</button>
					</div>
				}

				{
					listElement
				}


				<div className="loading-overlay" />
			</div>;
		}
	}
}
