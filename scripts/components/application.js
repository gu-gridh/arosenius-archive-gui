import React from 'react';

import Header from './Header';
import Search from './Search';
import ImageList from './ImageList';
import Timeline from './Timeline';

import EventBus from 'eventbusjs';

export default class Application extends React.Component {
	constructor(props) {
		super(props);

		this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

		window.eventBus = EventBus;

		this.state = {
			noUiDistract: false,
			searchParams: {},
			galleryType: 'gallery'
		};

		window.app = this;
	}

	mouseMoveHandler() {
		document.body.classList.remove('hide-ui');
	}

	componentDidMount() {
		this.setState({
			searchParams: {
				search: this.props.params.search || '',
				searchperson: this.props.params.searchperson ? this.props.params.searchperson.split(';') : null,
				person: this.props.params.person ? this.props.params.person.split(';') : null,
				place: this.props.params.place ? this.props.params.place.split(';') : null,
				museum: this.props.params.museum ? this.props.params.museum.split(';') : null,
				genre: this.props.params.genre ? this.props.params.genre.split(';') : null,
				tags: this.props.params.tags ? this.props.params.tags.split(';') : null,
				type: this.props.params.type ? this.props.params.type.split(';') : null,
				hue: this.props.params.hue,
				saturation: this.props.params.saturation
			}
		});
	}

	componentWillReceiveProps(props) {
		this.setState({
			searchParams: {
				search: props.params.search || '',
				searchperson: props.params.searchperson ? props.params.searchperson.split(';') : null,
				person: props.params.person ? props.params.person.split(';') : null,
				place: props.params.place ? props.params.place.split(';') : null,
				museum: props.params.museum ? props.params.museum.split(';') : null,
				genre: props.params.genre ? props.params.genre.split(';') : null,
				tags: props.params.tags ? props.params.tags.split(';') : null,
				type: props.params.type ? props.params.type.split(';') : null,
				hue: props.params.hue,
				saturation: props.params.saturation
			}
		})
	}

	render() {
		var galleryElement;

		if (this.state.galleryType == 'timeline') {
			galleryElement = <Timeline searchString={this.state.searchParams.search}
				searchPerson={this.state.searchParams.searchperson && this.state.searchParams.searchperson.length > 0 ? this.state.searchParams.searchperson : this.state.searchParams.person}
				searchPlace={this.state.searchParams.place}
				searchMuseum={this.state.searchParams.museum}
				searchGenre={this.state.searchParams.genre}
				searchTags={this.state.searchParams.tags}
				searchType={this.state.searchParams.type}
				searchHue={this.state.searchParams.hue}
				searchSaturation={this.state.searchParams.saturation} />;
		}
		else if (this.state.galleryType == 'simple-list') {
			galleryElement = <ImageList count="50" enableAutoLoad="true" listType="simple"
				searchString={this.state.searchParams.search}
				searchPerson={this.state.searchParams.searchperson && this.state.searchParams.searchperson.length > 0 ? this.state.searchParams.searchperson : this.state.searchParams.person}
				searchPlace={this.state.searchParams.place}
				searchMuseum={this.state.searchParams.museum}
				searchGenre={this.state.searchParams.genre}
				searchTags={this.state.searchParams.tags}
				searchType={this.state.searchParams.type}
				searchHue={this.state.searchParams.hue}
				searchSaturation={this.state.searchParams.saturation} />;
		}
		else {
			galleryElement = <ImageList count="50" enableAutoLoad="true"
				searchString={this.state.searchParams.search}
				searchPerson={this.state.searchParams.searchperson && this.state.searchParams.searchperson.length > 0 ? this.state.searchParams.searchperson : this.state.searchParams.person}
				searchPlace={this.state.searchParams.place}
				searchMuseum={this.state.searchParams.museum}
				searchGenre={this.state.searchParams.genre}
				searchTags={this.state.searchParams.tags}
				searchType={this.state.searchParams.type}
				searchHue={this.state.searchParams.hue}
				searchSaturation={this.state.searchParams.saturation} />;

		}

		var galleryTypes = [
			{
				type: 'timeline',
				menuItem: 'Tidslinje'
			},
			{
				type: 'gallery',
				menuItem: 'Galleri'
			},
			{
				type: 'simple-list',
				menuItem: 'Katalog'
			}
		];

		var galleryMenuItems = galleryTypes.map(function(galleryType) {
			return <a key={galleryType.type} className={this.state.galleryType == galleryType.type ? 'selected' : null} onClick={function() {this.setState({galleryType: galleryType.type})}.bind(this)}>{galleryType.menuItem}</a>;
		}.bind(this));

		return (
			<div onMouseMove={this.mouseMoveHandler} className={this.state.noUiDistract ? 'hide-ui' : ''}>
				<Header routerPath={this.props.location.pathname} />
				<div className={'site-content'+(this.props.location.pathname.substr(0, 7) == '/search' ? ' front' : '')}>
					{this.props.children}

					<Search searchParams={this.state.searchParams} />

					<div className="gallery-menu">
						{galleryMenuItems}
					</div>

					<div className="site-content">
						{
							galleryElement
						}
					</div>
				</div>
			</div>
		)
	}
}
