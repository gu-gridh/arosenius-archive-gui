import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

import ImageList from './ImageList';
import Search from './Search';
import WindowScroll from './../utils/window-scroll';

import config from './../config';

export default class ImageDisplay extends React.Component {
	constructor(props) {
		super(props);

		this.toggleFullDisplay = this.toggleFullDisplay.bind(this);
		this.imageLoadedHandler = this.imageLoadedHandler.bind(this);
		this.windowScrollHandler = this.windowScrollHandler.bind(this);
		this.windowResizeHandler = this.windowResizeHandler.bind(this);
		this.hideUiClick = this.hideUiClick.bind(this);
		this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
		this.imageDisplayClickHandler = this.imageDisplayClickHandler.bind(this);
		this.pageClickHandler = this.pageClickHandler.bind(this);

		this.searchFormSearchHandler = this.searchFormSearchHandler.bind(this);

		this.state = {
			image: null,
			imageUrl: null,
			currentImageUrl: null,
			fullDisplay: false,
			fullDisplayImageUrl: null,
			fixedImageButtons: true,
			flipped: false,
			flippable: false,
			currentPage: 1
		};
	}

	fetchData(imageId) {
		fetch(config.apiUrl+config.endpoints.document+imageId)
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({
					image: json.data,
					imageUrl: '',
					flipped: false,
					currentPage: 1
				});

				setTimeout(function() {
					this.loadImage();
				}.bind(this), 50);
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	pageClickHandler(event) {
		console.log(event.target.dataset.page);
	}

	toggleFullDisplay() {
		this.setState({
			fullDisplay: !this.state.fullDisplay
		}, function() {
			if (this.state.fullDisplay && !this.state.fullDisplayImageUrl) {
				// load fullDisplayImage
			}
			setTimeout(function() {
				this.positionImageButtons();
			}.bind(this), 500);
		}.bind(this));
	}

	imageDisplayClickHandler() {
		if (this.state.image.images.length == 2 || this.getPage(this.state.currentPage, 'back')) {
			this.setState({
				flipped: !this.state.flipped,
				currentImageUrl: config.imageUrl+this.state.image.images[this.state.flipped ? 0 : 1].image+'.jpg'
			});
		}
	}

	windowScrollHandler() {
		this.positionImageButtons();
	}

	windowResizeHandler() {
		this.positionImageButtons();
	}

	hideUiClick() {
		document.body.classList.add('hide-ui');
	}

	mouseMoveHandler() {
		if (this.mouseIdleTimer) {
			clearTimeout(this.mouseIdleTimer);
		}
		this.mouseIdleTimer = setTimeout(this.mouseIdleHandler.bind(this), 2000);
	}

	mouseIdleHandler() {
//		document.body.classList.add('hide-ui');
	}

	positionImageButtons() {
		if (this.refs.imageContainer) {		
			var imageContainerHeight = this.refs.imageContainer.clientHeight;
			var windowHeight = document.documentElement.clientHeight;
			var scrollPos = window.scrollY;

			if (imageContainerHeight+80 <= windowHeight) {
				this.setState({
					fixedImageButtons: false
				});
			}
			else if (imageContainerHeight < windowHeight+scrollPos-80) {
				this.setState({
					fixedImageButtons: false
				});
			}
			else {
				this.setState({
					fixedImageButtons: true
				});
			}
		}
	}

	loadImage() {
		if (this.state.image.images && this.state.image.images[0]) {
			var image = new Image();

			image.onload = this.imageLoadedHandler;
			image.onerror = this.imageErrorHandler;
			image.src = config.imageUrl+'1000x/'+this.state.image.images[0].image+'.jpg';
		}
	}

	imageLoadedHandler() {
		var imageUrl = config.imageUrl+'1000x/'+this.state.image.images[0].image+'.jpg';
		this.setState({
			imageUrl: imageUrl,
			currentImageUrl: config.imageUrl+this.state.image.images[0].image+'.jpg',
			flippable: this.state.image.images.length == 2 || this.getPage(this.state.currentPage, 'back')
		});

		setTimeout(function() {
			this.positionImageButtons();
		}.bind(this), 100);
	}

	imageErrorHandler(event) {
	}

	searchFormSearchHandler(event) {

	}

	componentDidMount() {
		this.fetchData(this.props.params.imageId);

		window.addEventListener('scroll', this.windowScrollHandler);
		window.addEventListener('resize', this.windowResizeHandler);

		this.positionImageButtons();

		setTimeout(function() {
			this.setState({
				searchString: this.props.params.search,
				searchPersons: this.props.params.person,
				searchPlace: this.props.params.place,
				searchMuseum: this.props.params.museum,
				searchGenre: this.props.params.genre,
				searchTags: this.props.params.tags,
				searchHue: this.props.params.hue,
				searchSaturation: this.props.params.saturation
			});
		}.bind(this), 200);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.windowScrollHandler);
		window.removeEventListener('resize', this.windowResizeHandler);

		if (this.mouseIdleTimer) {
			clearTimeout(this.mouseIdleTimer);
		}
	}

	componentWillReceiveProps(props) {
		this.setState({
			searchString: props.params.search,
			searchPersons: props.params.person,
			searchPlace: props.params.place,
			searchMuseum: props.params.museum,
			searchGenre: props.params.genre,
			searchTags: props.params.tags,
			searchHue: props.params.hue,
			searchSaturation: props.params.saturation
		});

		if (this.state.image && this.state.image.id != props.params.imageId) {
			this.fetchData(props.params.imageId);
			
			new WindowScroll().scrollToY(0, 1, 'easeInOutSine');
		}
	}

	getImageStyle(rearImage) {
		if (rearImage) {
			var imgObj = rearImage;
		}
		else {
			var imgObj = this.state.image.images[0];
		}

		var viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		var ratio = 0;

		var imageWidth = imgObj.imagesize.width;
		var imageHeight = imgObj.imagesize.height;

		if (this.state.fullDisplay) {
			ratio = viewWidth / imageWidth;
			imageWidth = viewWidth;
			imageHeight = imageHeight * ratio;
		}
		else {
			if (imageWidth > viewWidth){
				ratio = viewWidth / imageWidth;
				imageWidth = viewWidth;
				imageHeight = imageHeight * ratio;
			}

			if (imageHeight > viewHeight){
				ratio = viewHeight / imageHeight;
				imageHeight = viewHeight;
				imageWidth = imageWidth * ratio
			}
		}

		var imageStyle = imgObj.color && imgObj.color.colors ? {
			backgroundColor: imgObj.color.dominant.hex,
			backgroundImage: rearImage ? "url('"+config.imageUrl+"1000x/"+imgObj.image+".jpg')" : this.state.imageUrl && this.state.imageUrl != '' ? "url('"+this.state.imageUrl+"')" : null,

			width: imageWidth,
			height: imageHeight
		} : null;

		return imageStyle;
	}

	getPage(page, side) {
		return _.find(this.state.image.images, function(image) {
			return image.page && image.page.number == page && image.page.side == side;
		});
	}

	render() {
		if (this.state.image && this.state.image.images[0]) {
			document.title = 'Ivar Aroseniusarkivet - '+this.state.image.title;

			var colorElements = this.state.image.images[0].color ? this.state.image.images[0].color.colors.five.map(function(color, index) {
				return <a href={'#/search/color/'+color.hsv.h+'/'+color.hsv.s} key={index} className="color" style={{backgroundColor: color.hex}} ></a>
			}) : [];

			var persons = this.state.image.persons ? _.filter(this.state.image.persons, function(item) {
				return item != '';
			}) : [];

			var personsEls = persons.length > 0 ? persons.map(function(person, index) {
				if (person != '') {
					return <a key={index} href={'#/search/person/'+person}>{person}</a>;
				}
			}.bind(this)) : [];

			var relatedPersonImages = persons.length > 0 ? persons.map(function(person, index) {
				if (person != '') {
					return <div className="related-list" key={index}>
						<h3>Flera bilder av {person}</h3>
						<ImageList related="person" relatedValue={person} count="10" />
					</div>;
				}
			}) : [];

			var genres = this.state.image.genre ? _.filter(this.state.image.genre, function(item) {
				return item != '';
			}) : [];

			var relatedGenreImages = genres.length > 0 ? genres.map(function(genre, index) {
				if (genre != '') {
					return <div className="related-list" key={index}>
						<h3>Flera {genre.toLowerCase()}</h3>
						<ImageList related="genre" relatedValue={genre} count="10" />
					</div>;
				}
			}) : [];

			var genreEls =genres.length > 0 ? genres.map(function(genre, index) {
				if (genre != '') {
					return <a key={index} href={'#/search/genre/'+genre}>{genre.toLowerCase()}</a>;
				}
			}.bind(this)) : [];

			var relatedTagsImages = this.state.image.tags ? this.state.image.tags.map(function(tag, index) {
				if (tag != '') {
					return <div className="related-list" key={index}>
						<h3>Fler objekt relaterade till {tag.toLowerCase()}</h3>
						<ImageList related="tag" relatedValue={tag} count="10" />
					</div>;
				}
			}) : [];

			if (this.state.image.images.length > 2) {
				var pages = _.filter(this.state.image.images, function(image) {
					return image.page && image.page.side == 'front';
				});

				console.log(pages);

				var imageEls = pages.map(function(page, index) {
					return <a onClick={this.pageClickHandler} key={index} data-page={page.page.number} className={'thumb'+(page.page.number == this.state.currentPage ? ' selected' : '')}>
						<img src={config.imageUrl+'255x/'+page.image+'.jpg'}/>
					</a>
				}.bind(this));

			}

			var rearImageEl;
			if (this.state.image.images.length == 2 || this.getPage(this.state.currentPage, 'back')) {
				if (this.getPage(this.state.currentPage, 'back')) {
					rearImageEl = <div className="image-display image-rear" onClick={this.imageDisplayClickHandler} style={this.getImageStyle(this.getPage(this.state.currentPage, 'back'))}></div>;
				}
				else {
					rearImageEl = <div className="image-display image-rear" onClick={this.imageDisplayClickHandler} style={this.getImageStyle(this.state.image.images[1])}></div>;
				}
			}

			return <div className="image-display-module" onMouseMove={this.mouseMoveHandler}>

				<div ref="imageContainer" className={'image-container'+(this.state.fullDisplay ? ' full-display' : '')+(this.state.flippable ? ' flippable' : '')+(this.state.flipped ? ' flipped' : '')+(this.state.imageUrl && this.state.imageUrl != '' ? ' initialized' : '')}>
					<div className="image-display" onClick={this.imageDisplayClickHandler} style={this.getImageStyle()}>
						<div className="loader"></div>
					</div>

					{rearImageEl}

					<div ref="imageButtons" className={'image-buttons'+(this.state.fixedImageButtons ? ' fixed' : '')}>
						
						{/*<button className="icon-plus" onClick={this.hideUiClick}></button>*/}

						<a className="icon-download" href={this.state.currentImageUrl} target="_blank"></a>

						{/*<button className="icon-plus"></button>*/}

						<button className="toggle-show-all" style={{transitionDelay: '60ms'}} onClick={this.toggleFullDisplay}>
							<span className="icon-arrow arrow-1"></span>
							<span className="icon-arrow arrow-2"></span>
							Show all
						</button>

					</div>
				</div>

				{
					(this.state.image.images.length > 2) &&
					<div className="page-thumbnails">
						{imageEls}
					</div>
				}

				<div className="container">

					<h2>{this.state.image.title}</h2>

					<div className="row">
						{
							(this.state.image.item_date_str || (this.state.image.size && this.state.image.size.inner) || this.state.image.technique_material) &&

							<div className="four columns">
								{
									this.state.image.item_date_str &&
									<div><span className="label">Datering:</span> {this.state.image.item_date_str}</div>
								}
								{
									this.state.image.technique_material &&
									<div><span className="label">Teknik och material:</span> {this.state.image.technique_material}</div>
								}
								{
									this.state.image.size && this.state.image.size.inner &&
									<div><span className="label">Mått:</span> {this.state.image.size.inner.height+'x'+this.state.image.size.inner.width} cm</div>
								}
							</div>
						}

						<div className="four columns">
							<div><span className="label">Plats:</span> <a className="button-link" href={'#/search/museum/'+this.state.image.collection.museum}>{this.state.image.collection.museum}</a></div>
							{
								genreEls.length > 0 &&
								<div>
									<span className="label">Genre:</span> <span className="button-links">{genreEls}</span>
								</div>
							}
						</div>

						<div className="four columns">
							<div className="color-list">
								{colorElements}
							</div>
						</div>
					</div>

					<div className="row">
						{
							personsEls.length > 0 &&
							<div className="six columns">
								<br/>
								<span className="label">Personer:</span><br/>
								<span className="button-links">{personsEls}</span>
							</div>
						}
					</div>

					<br/>
					<p>{this.state.image.description}</p>

				</div>

				<div className="container">
					{
						relatedTagsImages.length > 0 &&
						<div>
							{relatedTagsImages}
						</div>
					}

					{
						relatedPersonImages.length > 0 &&
						<div>
							{relatedPersonImages}
						</div>
					}

					{
						relatedGenreImages.length > 0 &&
						<div>
							{relatedGenreImages}
						</div>
					}

					<div className="related-list">
						<h3>Fler objekt från {this.state.image.collection.museum}</h3>
						<ImageList related="museum" relatedValue={this.state.image.collection.museum} count="10" />
					</div>
				</div>

				<Search imageId={this.state.image.id} />
				<ImageList count="50" enableAutoLoad="true" searchString={this.state.searchString} 
					searchPerson={this.state.searchPersons} 
					searchPlace={this.state.searchPlace} 
					searchMuseum={this.state.searchMuseum}
					searchGenre={this.state.searchGenre}
					searchTags={this.state.searchTags}
					searchHue={this.state.searchHue}
					searchSaturation={this.state.searchSaturation} />

			</div>;
		}
		else {
			return <div>
			</div>;
		}
	}
}