import React from 'react';
import { hashHistory } from 'react-router';

import ThumbnailCircles from './ThumbnailCircles';
import ColorSearchSelector from './ColorSearchSelector';
import MultiTagsSelector from './MultiTagsSelector';
import DropdownMenu from './DropdownMenu';

import WindowScroll from './../utils/window-scroll';

export default class Search extends React.Component {
	constructor(props) {
		super(props);

		this.toggleButtonClick = this.toggleButtonClick.bind(this);
		this.triggerSearch = this.triggerSearch.bind(this);
		this.searchInputKeyPress = this.searchInputKeyPress.bind(this);
		this.searchInputChangeHandler = this.searchInputChangeHandler.bind(this);
		this.personSelectorChangeHandler = this.personSelectorChangeHandler.bind(this);
		this.colorSelectorSelect = this.colorSelectorSelect.bind(this);

		this.state = {
			searchString: this.props.searchString || '',
			searchPersons: this.props.searchPersons ? this.props.searchPersons.split(';') : [],
			searchHue: this.props.searchHue,
			searchSaturation: this.props.searchSaturation,
			open: Boolean(this.props.searchString || this.props.searchPersons || this.props.searchHue || this.props.searchSaturation || this.props.searchTags || this.props.searchGenre || this.props.searchPlace || this.props.searchPerson),
			searchMode: this.props.searchPersons ? 'persons' : this.props.searchHue && this.props.searchSaturation ? 'colors' : 'persons'
		};
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
		console.log(props);

		this.setState({
			searchString: props.searchString || '',
			searchPersons: props.searchPersons ? props.searchPersons.split(';') : [],
			searchHue: props.searchHue,
			searchSaturation: props.searchHue,
			open: Boolean(this.state.open || props.searchString || props.searchPersons || props.searchHue || props.searchSaturation || this.props.searchTags || this.props.searchGenre || this.props.searchPlace || this.props.searchPerson),
			searchMode: props.searchPersons ? 'persons' : props.searchHue && props.searchSaturation ? 'colors' : this.props.searchTags || this.props.searchGenre || this.props.searchPlace ? 'multi-tags' : 'persons'
		});

		if (!this.state.open && Boolean(props.searchString || props.searchPersons)) {
			var scroll = new WindowScroll();

			scroll.scrollToY(this.getOffsetTop(this.refs.searchButton), 1000, 'easeInOutSine');			
		}
	}

	toggleButtonClick() {
		this.setState({
			open: !this.state.open
		}, function() {
			if (this.state.open) {
				var scroll = new WindowScroll();
	
				scroll.scrollToY(this.getOffsetTop(this.refs.searchButton)-50, 1000, 'easeInOutSine');			
			}
		}.bind(this));
	}

	searchInputKeyPress(event) {
		if (event.charCode == 13) {
			this.triggerSearch();
		}
	}

	searchInputChangeHandler(event) {
		this.setState({
			searchString: event.target.value
		});
	}

	personSelectorChangeHandler(event) {
		this.setState({
			searchPersons: event.selectedPersons,
			searchHue: null,
			searchSaturation: null
		}, this.triggerSearch);
	}

	colorSelectorSelect(event) {
		this.setState({
			searchPersons: [],
			searchHue: event.hue,
			searchSaturation: event.saturation
		}, this.triggerSearch);
	}

	setSearchMode(mode) {
		this.refs.searchModeDropdownMenu.closeMenu();

		this.setState({
			searchMode: mode
		});
	}

	triggerSearch() {
		function encodeQueryData(data) {
			var ret = [];
			for (var d in data) {
				if (data[d].param && data[d].disableEncoding) {
					ret.push(encodeURIComponent(d) + '/' + data[d].param);
				}
				else {
					ret.push(encodeURIComponent(d) + '/' + encodeURIComponent(data[d]));
				}
			}
			return ret.join('/');
		}
		var searchParams = {};

		if (this.state.searchString != '') {
			searchParams['query'] = this.state.searchString;
		}

		if (this.state.searchPersons.length > 0) {
			searchParams['person'] = this.state.searchPersons.join(';');
		}

		if (this.state.searchHue && this.state.searchSaturation) {
			searchParams['color'] = {
				param: this.state.searchHue+'/'+this.state.searchSaturation,
				disableEncoding: true
			};
		}

		hashHistory.push((this.props.imageId ? '/image/'+this.props.imageId : '')+'/search/'+encodeQueryData(searchParams));
	}

	render() {
		var searchElement = this.state.searchMode == 'persons' ?
				<ThumbnailCircles selectedPersons={this.state.searchPersons} selectionChanged={this.personSelectorChangeHandler} />
			: this.state.searchMode == 'colors' ?
				<ColorSearchSelector onColorSelect={this.colorSelectorSelect} />
			: this.state.searchMode == 'multi-tags' ?
				<MultiTagsSelector />
			: null
		;

		return (
			<div className="search-module" ref="container">

				<button ref="searchButton" className="toggle-search-button" onClick={this.toggleButtonClick}>Search</button>

				<div className={'module-content'+(' mode-'+this.state.searchMode)+(this.state.open ? ' open' : '')}>
					<input value={this.state.searchString} 
						type="text" 
						placeholder="Skriv här..." 
						className="search-input" 
						onChange={this.searchInputChangeHandler} 
						onKeyPress={this.searchInputKeyPress} />

					<div className="filter-menu">
						<DropdownMenu ref="searchModeDropdownMenu" label="Filter &gt;">
							<button onClick={this.setSearchMode.bind(this, 'persons')}>Personer</button>
							<button onClick={this.setSearchMode.bind(this, 'colors')}>Färger</button>
							<button onClick={this.setSearchMode.bind(this, 'multi-tags')}>Multi-tags</button>
						</DropdownMenu>
					</div>

					{searchElement}
				</div>

			</div>
		)
	}
}