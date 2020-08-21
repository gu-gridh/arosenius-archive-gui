import React from 'react';
import { hashHistory } from 'react-router';

import ThumbnailCircles from './ThumbnailCircles';
import MultiTagsSelector from './MultiTagsSelector';
import DropdownMenu from './DropdownMenu';
import AutocompleteDiscoverInput from './AutocompleteDiscoverInput';

import WindowScroll from './../utils/window-scroll';

import config from './../config';

/*

Search component

- Here is the search input box as well as search filter components (faces, tags, )

*/
export default class Search extends React.Component {
	constructor(props) {
		super(props);

		this.toggleButtonClick = this.toggleButtonClick.bind(this);
		this.triggerSearch = this.triggerSearch.bind(this);
		this.searchInputKeyPress = this.searchInputKeyPress.bind(this);
		this.searchInputChangeHandler = this.searchInputChangeHandler.bind(this);
		this.personSelectorChangeHandler = this.personSelectorChangeHandler.bind(this);
		this.eventBusOpenHandler = this.eventBusOpenHandler.bind(this);
		this.eventBusOpenTagsHandler = this.eventBusOpenTagsHandler.bind(this);

		this.state = {
			searchParams: {}
		};
	}

	componentDidMount() {
		this.setState({
			searchParams: this.props.searchParams,
			open: Boolean(this.state.open || this.props.searchParams.search || this.props.searchParams.searchperson || this.props.searchParams.person || this.props.searchParams.museum || this.props.searchParams.tags || this.props.searchParams.type || this.props.searchParams.genre || this.props.searchParams.place),
			searchMode: this.props.searchParams.searchperson ? 'persons' : this.props.searchParams.person || this.props.searchParams.museum || this.props.searchParams.tags || this.props.searchParams.type || this.props.searchParams.genre || this.props.searchParams.place ? 'multi-tags' : this.state.searchMode
		});

		// Register listener for opening and closing the tags component
		window.eventBus.addEventListener('search.open', this.eventBusOpenHandler);
		window.eventBus.addEventListener('search.open-tags', this.eventBusOpenTagsHandler);
	}

	componentWillUnmount() {
		window.eventBus.removeEventListener('search.open', this.eventBusOpenHandler);
		window.eventBus.removeEventListener('search.open-tags', this.eventBusOpenTagsHandler);

	}

	componentWillReceiveProps(props) {
		if (!props.searchParams) {
			return;
		}

		this.setState({
			searchParams: props.searchParams,
			open: Boolean(this.state.open || props.searchParams.search || props.searchParams.searchperson || props.searchParams.person || props.searchParams.museum || props.searchParams.tags || props.searchParams.type || props.searchParams.genre || props.searchParams.place),
			searchMode: props.searchParams.searchperson ? 'persons' : props.searchParams.person || props.searchParams.museum || props.searchParams.tags || props.searchParams.type || props.searchParams.genre || props.searchParams.place ? 'multi-tags' : this.state.searchMode
		});
	}

	eventBusOpenTagsHandler() {
		this.setSearchMode('multi-tags');

		setTimeout(function() {
			var scroll = new WindowScroll();
			scroll.scrollToY(this.getOffsetTop(this.refs.searchButton), 800, 'easeInOutSine', true);
		}.bind(this), 200);
	}

	eventBusOpenHandler() {
		this.toggleButtonClick(true);
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

	toggleButtonClick(forceOpen) {
		this.setState({
			open: forceOpen ? true : !this.state.open
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

		hashHistory.push((this.props.imageId ? '/image/'+this.props.imageId : '')+'/search'+searchParams);
	}

	render() {
		var searchElement = this.state.searchMode == 'persons' ?
				<ThumbnailCircles selectedPersons={this.state.searchParams.searchperson} selectionChanged={this.personSelectorChangeHandler} />
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
						placeholder="Sök efter..."
						inputClassName="search-input" 
						onChange={this.searchInputChangeHandler} 
						onKeyPress={this.searchInputKeyPress} 
						defaultAction="setValue" />

					<div className="filter-menu">
						<DropdownMenu ref="searchModeDropdownMenu" label="Filter &gt;">
							<button onClick={this.setSearchMode.bind(this, 'persons')}>Personer</button>
							<button onClick={this.setSearchMode.bind(this, 'multi-tags')}>Nyckelord</button>
						</DropdownMenu>
					</div>

					{searchElement}

				</div>

			</div>
		)
	}
}
