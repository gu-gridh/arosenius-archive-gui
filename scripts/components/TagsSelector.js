import React from 'react';

import 'whatwg-fetch';
import _ from 'underscore';

import config from './../config';
import DropdownMenu from './DropdownMenu';

export default class TagsSelector extends React.Component {
	constructor(props) {
		super(props);

		this.itemClickHandler = this.itemClickHandler.bind(this);
		this.showAllButtonClickHandler = this.showAllButtonClickHandler.bind(this);

		this.state = {
			initialized: false,
			loading: true,
			data: [],
			selectedTag: this.props.selectedTag[this.props.searchParam] || ''
		};
	}

	componentDidMount() {
		this.fetchData();

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 300);

	}

	itemClickHandler(event) {
		if (this.props.onSelect) {
			this.props.onSelect({
				searchParam: this.props.searchParam,
				value: this.state.selectedTag == event.currentTarget.dataset.value ? null : event.currentTarget.dataset.value
			});
		}

		this.setState({
			selectedTag: this.state.selectedTag == event.currentTarget.dataset.value ? null : event.currentTarget.dataset.value
		});

		if (this.refs.dropdown) {
			this.refs.dropdown.closeMenu();
		}
	}

	showAllButtonClickHandler(event) {
		this.refs.dropdown.menuButtonClick();
	}

	fetchData() {
		var url = config.apiUrl+this.props.endpoint+'?sort=doc_count';

		fetch(url)
			.then(function(response) {
				return response.json();
			}).then(function(json) {
				this.loading = false;

				var data = json;

				if (this.props.sortFunction) {
					data = data.sort(this.props.sortFunction);
				}

				this.setState({
					loading: false,
					data: data
				}, function() {
					if (this.props.onLoad) {
						setTimeout(function() {
							this.props.onLoad();
						}.bind(this), 100);
					}
				}.bind(this));
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	componentWillReceiveProps(props) {
		this.setState({
			selectedTag: props.selectedTag[this.props.searchParam]
		});
	}

	render() {
		var createButton = function(item, index) {
			return <a key={item.value} 
				className={'button-link'+(this.state.selectedTag == item.value ? ' selected' : '')} 
				data-value={item.value} 
				onClick={this.itemClickHandler}
			>{item.value}</a>
		}.bind(this);

		var data = this.state.data.length > 0 ? _.filter(this.state.data, function(item) {
			return item.value && item.value != '';
		}) : [];

		if (this.props.expandable && this.props.dropdownItemsSortFunc) {
			console.log('sort')
			data = data.sort(this.props.dropdownItemsSortFunc);
		}

		var buttons = data.map(createButton);

		if (this.props.expandable) {
			var limit = Number(this.props.limit) || 10;

			var visibleContent = this.state.data.length > 0 ? _.filter(this.state.data, function(item, index) {
				//return item.value && item.value != '' && index < limit;
				return item.value && item.value != '' && index < (limit+10);
			}).map(createButton) : [];
		}

		return (
			<div className={'tag-selector'+(this.state.initialized ? ' initialized' : '')}>
				{
					this.props.title &&
					<h3>
						{this.props.title}
						{
							visibleContent && buttons.length > 0 &&
							<a className="dropdown-link" onClick={this.showAllButtonClickHandler}>Visa alla</a>
						}
					</h3>
				}

				<div className="button-list">
					{
						visibleContent ? visibleContent : buttons
					}
				</div>

				{
					visibleContent && buttons.length > 0 &&
					<DropdownMenu ref="dropdown" 
						showCloseButton={true} 
						disableScrollOnOpen={true} 
						onOpen={this.props.onDropdownOpen} 
						headerText={this.props.dropdownHeaderText} 
						label={this.props.dropdownButtonLabel || '...'}
					>
						{buttons}
					</DropdownMenu>
				}
			</div>
		)
	}
}