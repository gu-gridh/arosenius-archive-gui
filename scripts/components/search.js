import React from 'react';
import { hashHistory } from 'react-router';

import ThumbnailCircles from './thumbnail-circles';

export default class Search extends React.Component {
	constructor(props) {
		super(props);

		this.toggleButtonClick = this.toggleButtonClick.bind(this);
		this.triggerSearch = this.triggerSearch.bind(this);
		this.searchInputKeyPress = this.searchInputKeyPress.bind(this);

		this.state = {
			open: false
		};
	}

	toggleButtonClick() {
		this.setState({
			open: !this.state.open
		});
	}

	searchInputKeyPress(event) {
		if (event.charCode == 13) {
			this.triggerSearch();
		}
	}

	triggerSearch() {
		function encodeQueryData(data) {
			var ret = [];
			for (var d in data) {
				console.log(d);
				ret.push(encodeURIComponent(d) + '/' + encodeURIComponent(data[d]));
			}
			return ret.join('/');
		}
		var searchParams = {};

		if (this.refs.searchInput.value != '') {
			searchParams['query'] = this.refs.searchInput.value;
		}

		if (this.refs.personsList.state.selectedItem > -1) {
			searchParams['person'] = this.refs.personsList.thumbnails[this.refs.personsList.state.selectedItem].label;
		}

		hashHistory.push('/search/'+encodeQueryData(searchParams));
	}

	render() {
		return (
			<div className="search-module">

				<button className="toggle-search-button" onClick={this.toggleButtonClick}>Search</button>

				<div className={"module-content"+(this.state.open ? ' open' : '')}>
					<input ref="searchInput" type="text" placeholder="Skriv här..." className="search-input" onKeyPress={this.searchInputKeyPress} />

					<ThumbnailCircles ref="personsList" selectionChanged={this.triggerSearch} />
				</div>

			</div>
		)
	}
}