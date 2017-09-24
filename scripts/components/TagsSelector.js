import React from 'react';

import 'whatwg-fetch';
import _ from 'underscore';

import config from './../config';
import DropdownMenu from './DropdownMenu';

export default class TagsSelector extends React.Component {
	constructor(props) {
		super(props);

		this.itemClickHandler = this.itemClickHandler.bind(this);

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

	fetchData() {
		var url = config.apiUrl+this.props.endpoint;

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
		
		var buttons = this.state.data.length > 0 ? this.state.data.map(function(item, index) {
			if (item.value && item.value != '') {
				return <a key={item.value} 
					className={'button-link'+(this.state.selectedTag == item.value ? ' selected' : '')} 
					data-value={item.value} 
					onClick={this.itemClickHandler}
				>{item.value}</a>
			}
		}.bind(this)) : [];

		if (this.props.expandable) {
			var limit = Number(this.props.limit) || 10;

			var visibleContent = _.filter(buttons, function(button, index) {
				return index < limit;
			});
		}

		return (
			<div className={'tag-selector button-list'+(this.state.initialized ? ' initialized' : '')}>
				{visibleContent ? visibleContent : buttons}
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