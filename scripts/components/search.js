import React from 'react';
import { hashHistory } from 'react-router';

import ThumbnailCircles from './ThumbnailCircles';
import ColorSearchSelector from './ColorSearchSelector';
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

		this.state = {
			open: false,
			searchString: '',
			searchPerson: '',
			searchMode: 'persons'
		};
	}

	componentDidMount() {
		this.setState({
			searchString: this.props.searchString || '',
			searchPerson: this.props.searchPerson || '',
			open: Boolean(this.props.searchString || this.props.searchPerson)
		});
	}

	componentWillReceiveProps(props) {
		this.setState({
			searchString: props.searchString || '',
			searchPerson: props.searchPerson || '',
			open: Boolean(props.searchString || props.searchPerson)
		});

		if (!this.state.open && Boolean(props.searchString || props.searchPerson)) {
			var scroll = new WindowScroll();

			scroll.scrollToY(document.documentElement.clientHeight-200, 1000, 'easeInOutSine');			
		}
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

	searchInputChangeHandler(event) {
		this.setState({
			searchString: event.target.value
		});
	}

	personSelectorChangeHandler(event) {
		this.setState({
			searchPerson: event.selectedPerson
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
				ret.push(encodeURIComponent(d) + '/' + encodeURIComponent(data[d]));
			}
			return ret.join('/');
		}
		var searchParams = {};

		if (this.state.searchString != '') {
			searchParams['query'] = this.state.searchString;
		}

		if (this.state.searchPerson != '') {
			searchParams['person'] = this.state.searchPerson;
		}

		hashHistory.push('/search/'+encodeQueryData(searchParams));
	}

	render() {
		var searchElement = this.state.searchMode == 'persons' ?
				<ThumbnailCircles selectedPerson={this.state.searchPerson} selectionChanged={this.personSelectorChangeHandler} />
			: this.state.searchMode == 'colors' ?
				<ColorSearchSelector />
			: null
		;

		return (
			<div className="search-module">

				<button className="toggle-search-button" onClick={this.toggleButtonClick}>Search</button>

				<div className={'module-content'+(' mode-'+this.state.searchMode)+(this.state.open ? ' open' : '')}>
					<input value={this.state.searchString} 
						type="text" 
						placeholder="Skriv här..." 
						className="search-input" 
						onChange={this.searchInputChangeHandler} 
						onKeyPress={this.searchInputKeyPress} />

					<DropdownMenu ref="searchModeDropdownMenu" label="Filter &gt;">
						<button onClick={this.setSearchMode.bind(this, 'persons')}>Personer</button>
						<button onClick={this.setSearchMode.bind(this, 'colors')}>Färger</button>
					</DropdownMenu>

					{searchElement}
				</div>

			</div>
		)
	}
}