import React from 'react';
import { hashHistory } from 'react-router';

import ThumbnailCircles from './ThumbnailCircles';
import ColorSearchSelector from './ColorSearchSelector';
import MultiTagsSelector from './MultiTagsSelector';
import DropdownMenu from './DropdownMenu';
import AutocompleteDiscoverInput from './AutocompleteDiscoverInput';

import WindowScroll from './../utils/window-scroll';

import config from './../config';

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
	}

	componentDidMount() {
		this.setState({
			searchParams: this.props.searchParams,
			open: Boolean(this.state.open || this.props.searchParams.search || this.props.searchParams.searchperson || this.props.searchParams.person || this.props.searchParams.museum || this.props.searchParams.hue || this.props.searchParams.saturation || this.props.searchParams.tags || this.props.searchParams.type || this.props.searchParams.genre || this.props.searchParams.place),
			searchMode: this.props.searchParams.searchperson ? 'persons' : this.props.searchParams.hue && this.props.searchParams.saturation ? 'colors' : this.props.searchParams.person || this.props.searchParams.museum || this.props.searchParams.tags || this.props.searchParams.type || this.props.searchParams.genre || this.props.searchParams.place ? 'multi-tags' : this.state.searchMode
		});
		window.eventBus.addEventListener('search.open-tags', this.eventBusOpenTagsHandler);

//		window.eventBus.addEventListener('application.searchParams', this.receivedSearchParamsHandler);
	}

	componentWillUnmount() {
		window.eventBus.removeEventListener('search.open-tags', this.eventBusOpenTagsHandler);

		window.eventBus.removeEventListener('application.searchParams', this.receivedSearchParamsHandler);		
	}

	componentWillReceiveProps(props) {
		if (!props.searchParams) {
			return;
		}

		this.setState({
			searchParams: props.searchParams,
			open: Boolean(this.state.open || props.searchParams.search || props.searchParams.searchperson || props.searchParams.person || props.searchParams.museum || props.searchParams.hue || props.searchParams.saturation || props.searchParams.tags || props.searchParams.type || props.searchParams.genre || props.searchParams.place),
			searchMode: props.searchParams.searchperson ? 'persons' : props.searchParams.hue && props.searchParams.saturation ? 'colors' : props.searchParams.person || props.searchParams.museum || props.searchParams.tags || props.searchParams.type || props.searchParams.genre || props.searchParams.place ? 'multi-tags' : this.state.searchMode
		});

		if (!this.state.open && Boolean(props.searchParams.searchString || props.searchParams.searchperson)) {
//			var scroll = new WindowScroll();

//			scroll.scrollToY(this.getOffsetTop(this.refs.searchButton), 1000, 'easeInOutSine');			
		}
	}

	eventBusOpenTagsHandler() {
		this.setSearchMode('multi-tags');

		setTimeout(function() {
			var scroll = new WindowScroll();
			scroll.scrollToY(this.getOffsetTop(this.refs.searchButton), 800, 'easeInOutSine', true);
		}.bind(this), 200);
	}

	getOffsetTop(el) {
		var offsetTop = 0;
		if (!el) {
			return 0;
		}

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
			open: Boolean(this.state.open || params.search || params.searchperson || params.person || params.museum || params.hue || params.saturation || params.tags || params.type || params.genre || params.place),
			searchMode: params.searchperson ? 'persons' : params.hue && params.saturation ? 'colors' : params.person || params.museum || params.tags || params.type || params.genre || params.place ? 'multi-tags' : this.state.searchMode
		});

		if (!this.state.open && Boolean(params.searchString || params.searchperson)) {
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
	
				scroll.scrollToY(this.getOffsetTop(this.refs.searchButton)-50, 800, 'easeInOutSine', true);

				this.refs.searchInput.focus();
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
		}, function() {
			if (event.triggerSearch) {
				this.triggerSearch();
			}
		}.bind(this));
	}

	personSelectorChangeHandler(event) {
		var searchParams = this.state.searchParams;
		searchParams.searchperson = event.selectedPersons;
		searchParams.hue = null;
		searchParams.saturation = null;

		this.setState({
			searchParams: searchParams
		}, this.triggerSearch);
	}

	colorSelectorSelect(event) {
		var searchParams = this.state.searchParams;
		searchParams.searchperson = [];
		searchParams.hue = event.hue;
		searchParams.saturation = event.saturation;

		this.setState({
			searchParams: searchParams
		}, this.triggerSearch);
	}

	setSearchMode(mode) {
		setTimeout(function() {
			this.refs.searchModeDropdownMenu.closeMenu();

			if (mode != this.state.searchMode) {
				window.eventBus.dispatch('search.mode-changed');
			}

			this.setState({
				searchMode: mode,
				manualOpen: true
			});
		}.bind(this), 100);
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

		if (this.state.searchParams.search && this.state.searchParams.search != '') {
			searchParams += '/query/'+this.state.searchParams.search;
		}

		if (this.state.searchParams.searchperson && this.state.searchParams.searchperson.length > 0) {
			searchParams += '/person/'+this.state.searchParams.searchperson.join(';');
		}

		if (this.state.searchParams.hue && this.state.searchParams.saturation) {
			searchParams += '/color/'+this.state.searchParams.hue+'/'+this.state.searchParams.saturation;
		}

		hashHistory.push((this.props.imageId ? '/image/'+this.props.imageId : '')+'/search'+searchParams);
	}

	render() {
		var searchElement = this.state.searchMode == 'persons' ?
				<ThumbnailCircles selectedPersons={this.state.searchParams.searchperson} selectionChanged={this.personSelectorChangeHandler} />
			: this.state.searchMode == 'colors' ?
				<ColorSearchSelector onColorSelect={this.colorSelectorSelect} />
			: this.state.searchMode == 'multi-tags' ?
				<MultiTagsSelector 
					museum={this.state.searchParams.museum} 
					genre={this.state.searchParams.genre} 
					tags={this.state.searchParams.tags} 
					type={this.state.searchParams.type}
					person={this.state.searchParams.person} 
					place={this.state.searchParams.place} />
			: null
		;

		return (
			<div className={'search-module'+(this.state.open || this.state.manualOpen ? ' open' : '')} ref="container">

				<button ref="searchButton" className="toggle-search-button" onClick={this.toggleButtonClick}>Search</button>

				<div className={'module-content'+(' mode-'+(this.state.searchMode || 'persons'))}>
					<AutocompleteDiscoverInput 
						ref="searchInput" 
						searchUrl={config.apiUrl+config.endpoints.autocomplete+'?search=$s'}
						dataField="titles"
						valueField="key"
						value={this.state.searchParams.search} 
						type="text" 
						placeholder="Skriv här..." 
						inputClassName="search-input" 
						onChange={this.searchInputChangeHandler} 
						onKeyPress={this.searchInputKeyPress} 
						defaultAction="setValue" />

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