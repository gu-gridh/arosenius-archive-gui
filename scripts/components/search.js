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
		this.eventBusOpenTagsHandler = this.eventBusOpenTagsHandler.bind(this);
		this.receivedSearchParamsHandler = this.receivedSearchParamsHandler.bind(this);

		this.state = {
			searchParams: {}
		};

		window.eventBus.addEventListener('search.open-tags', this.eventBusOpenTagsHandler);

		window.eventBus.addEventListener('application.searchParams', this.receivedSearchParamsHandler);
	}

	eventBusOpenTagsHandler() {
		this.setSearchMode('multi-tags');

		var scroll = new WindowScroll();
		scroll.scrollToY(this.getOffsetTop(this.refs.searchButton), 1000, 'easeInOutSine');			
	}

	getOffsetTop(el) {
		var offsetTop = 0;
		do {
			if (!isNaN(el.offsetTop )) {
				offsetTop += el.offsetTop;
			}
		} while (el = el.offsetParent);

		return offsetTop;
	}

	receivedSearchParamsHandler(event, params) {
		this.setState({
			searchParams: params,
			open: Boolean(this.state.open || params.search || params.searchpersons || params.persons || params.museum || params.hue || params.saturation || params.tags || params.type || params.genre || params.place),
			searchMode: params.searchpersons ? 'persons' : params.hue && params.saturation ? 'colors' : params.persons || params.museum || params.tags || params.type || params.genre || params.place ? 'multi-tags' : this.state.searchMode
		});

		if (!this.state.open && Boolean(params.searchString || params.searchpersons)) {
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
		var searchParams = this.state.searchParams;
		searchParams.search = event.target.value;

		this.setState({
			searchParams: searchParams
		});
	}

	personSelectorChangeHandler(event) {
		var searchParams = this.state.searchParams;
		searchParams.searchpersons = event.selectedPersons;
		searchParams.hue = null;
		searchParams.saturation = null;

		this.setState({
			searchParams: searchParams
		}, this.triggerSearch);
	}

	colorSelectorSelect(event) {
		var searchParams = this.state.searchParams;
		searchParams.searchpersons = [];
		searchParams.hue = event.hue;
		searchParams.saturation = event.saturation;

		this.setState({
			searchParams: searchParams
		}, this.triggerSearch);
	}

	setSearchMode(mode) {
		this.refs.searchModeDropdownMenu.closeMenu();

		if (mode != this.state.searchMode) {
//			hashHistory.push('/search');
			window.eventBus.dispatch('search.mode-changed');
		}

		this.setState({
			searchMode: mode,
			manualOpen: true
		}, function() {
		}.bind(this));
	}

	triggerSearch() {
		function encodeQueryData(data) {
			var ret = [];
			for (var d in data) {
				if (data[d].param && data[d].disableEncoding) {
					ret.push(encodeURIComponent(d)+'/'+data[d].param);
				}
				else {
					ret.push(encodeURIComponent(d)+'/'+encodeURIComponent(data[d]));
				}
			}
			return ret.join('/');
		}
		var searchParams = '';

		if (this.state.searchParams.search != '') {
			searchParams += '/query/'+this.state.searchParams.search;
		}

		if (this.state.searchParams.searchpersons.length > 0) {
			searchParams += '/persons/'+this.state.searchParams.searchpersons.join(';');
		}

		if (this.state.searchParams.hue && this.state.searchParams.saturation) {
			searchParams += '/color/'+this.state.searchParams.hue+'/'+this.state.searchParams.saturation;
		}

		hashHistory.push((this.props.imageId ? '/image/'+this.props.imageId : '')+'/search'+searchParams);
	}

	render() {
		var searchElement = this.state.searchMode == 'persons' ?
				<ThumbnailCircles selectedPersons={this.state.searchParams.searchpersons} selectionChanged={this.personSelectorChangeHandler} />
			: this.state.searchMode == 'colors' ?
				<ColorSearchSelector onColorSelect={this.colorSelectorSelect} />
			: this.state.searchMode == 'multi-tags' ?
				<MultiTagsSelector 
					museum={this.state.searchParams.museum} 
					genre={this.state.searchParams.genre} 
					tags={this.state.searchParams.tags} 
					type={this.state.searchParams.type}
					persons={this.state.searchParams.persons} 
					place={this.state.searchParams.place} />
			: null
		;

		return (
			<div className="search-module" ref="container">

				<button ref="searchButton" className="toggle-search-button" onClick={this.toggleButtonClick}>Search</button>

				<div className={'module-content'+(' mode-'+(this.state.searchMode || 'persons'))+(this.state.open || this.state.manualOpen ? ' open' : '')}>
					<input value={this.state.searchParams.search} 
						type="text" 
						placeholder="Skriv här..." 
						className="search-input" 
						onChange={this.searchInputChangeHandler} 
						onKeyPress={this.searchInputKeyPress} />

					<div className="filter-menu">
						<DropdownMenu ref="searchModeDropdownMenu" label="Filter &gt;">
							<button onClick={this.setSearchMode.bind(this, 'persons')}>Personer</button>
							<button onClick={this.setSearchMode.bind(this, 'colors')} style={{display: 'none'}}>Färger</button>
							<button onClick={this.setSearchMode.bind(this, 'multi-tags')}>Nyckelord</button>
						</DropdownMenu>
					</div>

					{searchElement}
				</div>

			</div>
		)
	}
}