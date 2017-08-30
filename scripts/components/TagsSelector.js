import React from 'react';

import 'whatwg-fetch';
import _ from 'underscore';

import config from './../config';
import DropdownMenu from './DropdownMenu';

export default class TagsSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialized: false,
			loading: true,
			data: []
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

	fetchData() {
		var url = config.apiUrl+this.props.endpoint;

		fetch(url)
			.then(function(response) {
				return response.json();
			}).then(function(json) {
				this.loading = false;

				this.setState({
					loading: false,
					data: json
				});
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	componentWillReceiveProps(props) {
	}

	render() {
		var buttons = this.state.data.length > 0 ? this.state.data.map(function(item, index) {
			if (item.value != '') {
				return <a key={item.value} className="button-link" data-value={item.value} href={'#/search/'+this.props.searchParam+'/'+item.value}>{item.value}</a>
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
					<DropdownMenu onOpen={this.props.onDropdownOpen} headerText={this.props.dropdownHeaderText} label={this.props.dropdownButtonLabel || '...'}>
						{buttons}
					</DropdownMenu>
				}
			</div>
		)
	}
}