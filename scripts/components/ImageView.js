import React from 'react';

import 'whatwg-fetch';
import _ from 'underscore';

import ReactSwipeEvents from 'react-swipe-events';

import ImageList from './ImageList';
import ImageDisplay from './ImageDisplay';
import Search from './Search';
import WindowScroll from './../utils/window-scroll';

import config from './../config';

import chroma from 'chroma-js';

export default class ImageView extends React.Component {
	constructor(props) {
		super(props);

		this.pageClickHandler = this.pageClickHandler.bind(this);
		this.imageSwipedHandler = this.imageSwipedHandler.bind(this);
		this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

		this.searchFormSearchHandler = this.searchFormSearchHandler.bind(this);

		this.state = {
			image: null,
			fullDisplay: false,
			fixedImageButtons: true,
			flipped: false,
			flippable: false,
			currentPage: 1
		};

		this.mouseIdleDuration = 3000;
	}

	mouseMoveHandler() {
		document.body.classList.remove('hide-ui');

		if (this.mouseIdleTimer) {
			clearTimeout(this.mouseIdleTimer);
		}

		this.mouseIdleTimer = setTimeout(function() {
			if (this.refs.imageDisplay.state.enlargedDisplay) {
				document.body.classList.add('hide-ui');
			}
		}.bind(this), this.mouseIdleDuration);
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
		// Do nothing if component in fullDisplay mode
		if (this.state.fullDisplay) {
			return;
		}

		// Do nothing if only a minor swipe
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
				fullDisplay: this.props.params.display == 'full'
			});
		}.bind(this), 200);

//		window.scrollTo(0, 0);
		new WindowScroll().scrollToY(0, 1, 'easeInOutSine');
	}

	componentWillReceiveProps(props) {
		this.setState({
			fullDisplay: props.params.display == 'full'
		});

		if (this.state.image && this.state.image.id != props.params.imageId) {
			this.fetchData(props.params.imageId);

			new WindowScroll().scrollToY(0, 1, 'easeInOutSine');
		}
	}

	componentWillUnmount() {
		document.body.classList.remove('hide-ui');

		if (this.mouseIdleTimer) {
			clearTimeout(this.mouseIdleTimer);
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
/*
			var colorElements = this.state.image.images[0].color ? this.state.image.images[0].color.colors.five.map(function(color, index) {
				return <a href={'#/search/color/'+color.hsv.h+'/'+color.hsv.s} key={index} className="color" style={{backgroundColor: color.hex}} ></a>
			}) : [];
*/
			var colorElements = this.state.image.images[0].googleVisionColors ? this.state.image.images[0].googleVisionColors.map(function(color, index) {
				return color.hsv && color.hsv.h ? <a href={'#/search/color/'+color.hsv.h+'/'+color.hsv.s} key={index} style={{display: 'block', float: 'left', height: 10, width: (color.score*100)+'%', backgroundColor: chroma(color.color.red, color.color.green, color.color.blue).hex()}}></a> : null;
			}) : [];

			var persons = this.state.image.persons ? _.filter(this.state.image.persons, function(item) {
				return item != '';
			}) : [];

			var places = this.state.image.places ? _.filter(this.state.image.places, function(item) {
				return item != '';
			}) : [];

			var personEls = persons.length > 0 ? persons.map(function(person, index) {
				if (person != '') {
					return <a key={person} className="button-link" href={'#/search/person/'+person}>{person}</a>;
				}
			}.bind(this)) : [];

			var placeEls = places.length > 0 ? places.map(function(place, index) {
				if (place != '') {
					return <a key={place} className="button-link" href={'#/search/tags/place/'+place}>{place}</a>;
				}
			}.bind(this)) : [];

			var relatedPlacesImages = places.length > 0 ? places.map(function(place, index) {
				if (place != '') {
					return <div className="related-list" key={place}>
						<ImageList title={'Fler bilder från '+place} related="place" relatedValue={place} count="10" />
					</div>;
				}
			}) : [];

			var relatedPersonImages = persons.length > 0 ? persons.map(function(person, index) {
				if (person != '') {
					return <div className="related-list" key={person}>
						<ImageList title={'Fler bilder av '+person} related="person" relatedValue={person} archiveMaterial="exclude" count="10" />
					</div>;
				}
			}) : [];

			var relatedPersonArchiveMaterial = persons.length > 0 ? persons.map(function(person, index) {
				if (person != '') {
					return <div className="related-list" key={person}>
						<ImageList title={'Fler arkivdokument relaterade till '+person} related="person" relatedValue={person} archiveMaterial="only" count="10" />
					</div>;
				}
			}) : [];

			var genres = this.state.image.genre ? _.filter(this.state.image.genre, function(item) {
				return item != '';
			}) : [];

			var relatedGenreImages = genres.length > 0 ? genres.map(function(genre, index) {
				if (genre != '') {
					return <div className="related-list" key={genre}>
						<ImageList title={'Fler objekt av underkategorin '+genre.toLowerCase()} related="genre" relatedValue={genre} count="10" />
					</div>;
				}
			}) : [];

			var genreEls = genres.length > 0 ? genres.map(function(genre, index) {
				if (genre != '') {
					return <a key={genre} className="button-link" href={'#/search/tags/genre/'+genre}>{genre.toLowerCase()}</a>;
				}
			}.bind(this)) : [];

			var types = this.state.image.type ? _.filter(this.state.image.type, function(item) {
				return item != '';
			}) : [];

			var typeEls = types.length > 0 ? types.map(function(type, index) {
				if (type != '') {
					return <a key={type} className="button-link" href={'#/search/tags/type/'+type}>{type.toLowerCase()}</a>;
				}
			}.bind(this)) : [];

			var relatedTagsImages = this.state.image.tags ? this.state.image.tags.map(function(tag, index) {
				if (tag != '') {
					return <div className="related-list" key={tag}>
						<ImageList title={'Fler objekt relaterade till '+tag.toLowerCase()} related="tag" relatedValue={tag} count="10" />
					</div>;
				}
			}) : [];

			var tags = this.state.image.tags ? _.filter(this.state.image.tags, function(item) {
				return item != '';
			}) : [];

			var tagEls = tags.length > 0 ? tags.map(function(tag, index) {
				if (tag != '') {
					return <a key={tag} className="button-link" href={'#/search/tags/tags/'+tag}>{tag.toLowerCase()}</a>;
				}
			}.bind(this)) : [];

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

				<a style={{position: 'absolute', top: 0, right: 0, width: 35, height: 35, backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: 2000}} className="admin-link" href={config.adminUrl+'/#document/'+this.state.image.id} />

				<ReactSwipeEvents onSwiped={this.imageSwipedHandler}>
					<ImageDisplay ref="imageDisplay" pathname={this.props.location.pathname} image={imageObj} fullDisplay={this.state.fullDisplay} />
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
									<div className="attribute"><span className="label">Datering:</span> {this.state.image.item_date_str}</div>
								}
								{
									this.state.image.technique_material &&
									<div className="attribute"><span className="label">Teknik och material:</span> {this.state.image.technique_material}</div>
								}
								{
									this.state.image.size && this.state.image.size.inner &&
									<div className="attribute"><span className="label">Mått:</span> {this.state.image.size.inner.height+'x'+this.state.image.size.inner.width} cm</div>
								}
							</div>
						}

						<div className="four columns">
							<div className="attribute bottom-margin-5"><span className="label">Samling:</span> <a className="button-link" href={'#/search/tags/museum/'+this.state.image.collection.museum}>{this.state.image.collection.museum}</a></div>
							{
								typeEls.length > 0 &&
								<div className="attribute bottom-margin-5">
									<span className="label">Kategori:</span> {typeEls}
								</div>
							}
							{
								genreEls.length > 0 &&
								<div className="attribute bottom-margin-5">
									<span className="label">Underkategori:</span> {genreEls}
								</div>
							}
							{
								placeEls.length > 0 &&
								<div className="attribute bottom-margin-5">
									<span className="label">Platser:</span> {placeEls}
								</div>
							}
						</div>

						<div className="four columns">
							{
								personEls.length > 0 &&
								<div className="attribute bottom-margin-5">
									<span className="label">Personer:</span> {personEls}
								</div>
							}
							{
								tagEls.length > 0 &&
								<div className="attribute bottom-margin-5">
									<span className="label">Taggar:</span> {tagEls}
								</div>
							}
						</div>
					</div>

					{
					/*
					<div className="row">
						<br />
						<div className="color-list" style={{width: '60%'}}>
							{colorElements}
						</div>
					</div>
					*/
					}

					<br />
					<p>{this.state.image.description}</p>

					{
						this.state.image.content &&
						<div>
							<br />
							<h3>Transkription</h3>
							<div className="text-container">
								<p dangerouslySetInnerHTML={{__html: this.state.image.content.split('\n').join('<br />')}} />
							</div>
						</div>
					}

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
						relatedPlacesImages.length > 0 &&
						<div>
							{relatedPlacesImages}
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

			</div>;
		}
		else {
			return <div>
			</div>;
		}
	}
}
