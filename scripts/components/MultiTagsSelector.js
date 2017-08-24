import React from 'react';

import config from './../config';

import _ from 'underscore';

import TagsSelector from './TagsSelector';

export default class MultiTagsSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialized: false
		};
	}

	componentDidMount() {
		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 300);

	}

	onDropdownOpen(dropDownName) {
		console.log(dropDownName);
		this.setState({
			openDropdown: dropDownName
		});
	}

	componentWillReceiveProps(props) {
	}

	render() {
		return (
			<div className={'fade-in-component multitags-selector'+(this.state.initialized ? ' initialized' : '')}>

				<div className="row">

					<div className="three columns">
						<h3>Personer</h3>
						<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'personer')} dropdownHeaderText="Personer" expandable="true" limit="10" searchParam="person" endpoint={config.endpoints.persons} />
					</div>

					<div className="three columns">
						<h3>Ort</h3>
						<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} dropdownHeaderText="Ort" expandable="true" limit="10" searchParam="place" endpoint={config.endpoints.places} />
					</div>

					<div className="three columns">
						<h3>Tags</h3>
						<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'tags')} dropdownHeaderText="Tags" expandable="true" limit="10" searchParam="tags" endpoint={config.endpoints.tags} />
					</div>

					<div className="three columns">
						<h3>Genre</h3>
						<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'genre')} dropdownHeaderText="Genre" expandable="true" limit="10" searchParam="genre" endpoint={config.endpoints.genres} />
					</div>

				</div>

			</div>
		)
	}
}