import React from 'react';

import 'whatwg-fetch';
import _ from 'underscore';

import ReactSwipeEvents from 'react-swipe-events';

import ImageList from './ImageList';
import ImageDisplay from './ImageDisplay';
import Search from './Search';
import WindowScroll from './../utils/window-scroll';

import config from './../config';

export default class ImageView extends React.Component {
	constructor(props) {
		super(props);

		window.imageView = this;

		this.pageClickHandler = this.pageClickHandler.bind(this);
		this.imageSwipedHandler = this.imageSwipedHandler.bind(this);

		this.searchFormSearchHandler = this.searchFormSearchHandler.bind(this);

		this.state = {
			image: null,
			fullDisplay: false,
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
					flipped: false,
					currentPage: 1
				}, function() {
					this.forceUpdate();
				}.bind(this));
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	pageClickHandler(event) {
		this.setPage(event.currentTarget.dataset.page);
	}

	imageSwipedHandler(event, originalX, originalY, endX, endY, deltaX, deltaY) {
		if (Math.abs(deltaY) > 100 || Math.abs(deltaX) < 50) {
			return;
		}

		if (originalX < endX) {
			if (this.getPage(this.state.currentPage-1, 'front')) {
				this.setPage(this.state.currentPage-1);
			}
		}
		else {
			if (this.getPage(this.state.currentPage+1, 'front')) {
				this.setPage(this.state.currentPage+1);
			}
		}
	}

	setPage(page) {
		this.setState({
			currentPage: page
		});
	}

	searchFormSearchHandler(event) {

	}

	componentDidMount() {
		this.fetchData(this.props.params.imageId);

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
					return <a key={person} href={'#/search/person/'+person}>{person}</a>;
				}
			}.bind(this)) : [];

			var relatedPersonImages = persons.length > 0 ? persons.map(function(person, index) {
				if (person != '') {
					return <div className="related-list" key={person}>
						<ImageList title={'Flera bilder av '+person} related="person" relatedValue={person} archiveMaterial="exclude" count="10" />
					</div>;
				}
			}) : [];

			var relatedPersonArchiveMaterial = persons.length > 0 ? persons.map(function(person, index) {
				if (person != '') {
					return <div className="related-list" key={person}>
						<ImageList title={'Flera arkivdokument relaterade till '+person} related="person" relatedValue={person} archiveMaterial="only" count="10" />
					</div>;
				}
			}) : [];

			var genres = this.state.image.genre ? _.filter(this.state.image.genre, function(item) {
				return item != '';
			}) : [];

			var relatedGenreImages = genres.length > 0 ? genres.map(function(genre, index) {
				if (genre != '') {
					return <div className="related-list" key={genre}>
						<ImageList title={'Flera '+genre.toLowerCase()} related="genre" relatedValue={genre} count="10" />
					</div>;
				}
			}) : [];

			var genreEls =genres.length > 0 ? genres.map(function(genre, index) {
				if (genre != '') {
					return <a key={genre} href={'#/search/genre/'+genre}>{genre.toLowerCase()}</a>;
				}
			}.bind(this)) : [];

			var relatedTagsImages = this.state.image.tags ? this.state.image.tags.map(function(tag, index) {
				if (tag != '') {
					return <div className="related-list" key={tag}>
						<ImageList title={'Fler objekt relaterade till '+tag.toLowerCase()} related="tag" relatedValue={tag} count="10" />
					</div>;
				}
			}) : [];

			if (_.filter(this.state.image.images, function(image) {
					return image.page && (image.page.side == 'front' || image.page.side == 'back');
				}).length > 2) {
				var pages = _.filter(this.state.image.images, function(image) {
					return image.page && image.page.side == 'front';
				});

				var imageEls = pages.map(function(page, index) {
					return <a onClick={this.pageClickHandler} key={page.image} data-page={page.page.number} className={'thumb'+(page.page.number == this.state.currentPage ? ' selected' : '')}>
						<img src={config.imageUrl+'255x/'+page.image+'.jpg'}/>
					</a>
				}.bind(this));

			}

			var imageObj = {};

			if (this.state.image.images.length == 2) {
				imageObj['front'] = this.state.image.images[0];
				imageObj['back'] = this.state.image.images[1];
			}
			else if (this.state.image.images.length > 2) {
				imageObj['front'] = this.getPage(this.state.currentPage, 'front') || this.state.image.images[0];
				if (this.getPage(this.state.currentPage, 'back')) {
					imageObj['back'] = this.getPage(this.state.currentPage, 'back');
				}
//				imageObj['back'] = this.getPage(this.state.currentPage, 'back') || this.state.image.images[1];
			}
			else {
				imageObj['front'] = this.state.image.images[0];
			}

			return <div className="image-display-module" onMouseMove={this.mouseMoveHandler}>

				<ReactSwipeEvents onSwiped={this.imageSwipedHandler}>
					<ImageDisplay image={imageObj} />
				</ReactSwipeEvents>

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
						relatedPersonArchiveMaterial.length > 0 &&
						<div>
							{relatedPersonArchiveMaterial}
						</div>
					}

					{
						relatedGenreImages.length > 0 &&
						<div>
							{relatedGenreImages}
						</div>
					}

					<div className="related-list">
						<ImageList title={'Fler objekt från '+this.state.image.collection.museum} related="museum" relatedValue={this.state.image.collection.museum} count="10" />
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