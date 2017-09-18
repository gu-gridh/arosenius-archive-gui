import React from 'react';

import Header from './Header';

import EventBus from 'eventbusjs';

export default class Application extends React.Component {
	constructor(props) {
		super(props);

		this.mouseMoveHandler = this.mouseMoveHandler.bind(this);

		window.eventBus = EventBus;

		this.state = {
			noUiDistract: false
		};

		window.app = this;
	}

	mouseMoveHandler() {
		document.body.classList.remove('hide-ui');
	}

	componentDidMount() {
		eventBus.dispatch('application.searchParams', this, {
			search: this.props.params.search || '',
			searchpersons: this.props.params.searchpersons ? this.props.params.searchpersons.split(';') : null,
			persons: this.props.params.persons ? this.props.params.persons.split(';') : null,
			place: this.props.params.place ? this.props.params.place.split(';') : null,
			museum: this.props.params.museum ? this.props.params.museum.split(';') : null,
			genre: this.props.params.genre ? this.props.params.genre.split(';') : null,
			tags: this.props.params.tags ? this.props.params.tags.split(';') : null,
			type: this.props.params.type ? this.props.params.type.split(';') : null,
			hue: this.props.params.hue,
			saturation: this.props.params.saturation
		});
	}

	componentWillReceiveProps(props) {
		eventBus.dispatch('application.searchParams', this, {
			search: props.params.search || '',
			searchpersons: props.params.searchpersons ? props.params.searchpersons.split(';') : null,
			persons: props.params.persons ? props.params.persons.split(';') : null,
			place: props.params.place ? props.params.place.split(';') : null,
			museum: props.params.museum ? props.params.museum.split(';') : null,
			genre: props.params.genre ? props.params.genre.split(';') : null,
			tags: props.params.tags ? props.params.tags.split(';') : null,
			type: props.params.type ? props.params.type.split(';') : null,
			hue: props.params.hue,
			saturation: props.params.saturation
		});
	}

	render() {
		return (
			<div onMouseMove={this.mouseMoveHandler} className={this.state.noUiDistract ? 'hide-ui' : ''}>
				<Header routerPath={this.props.location.pathname} />
				<div className="site-content">
					{this.props.children}
				</div>
			</div>
		)
	}
}