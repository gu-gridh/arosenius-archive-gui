import React from 'react';
import { hashHistory } from 'react-router';

import config from './../config';

import _ from 'underscore';

import TagsSelector from './TagsSelector';

export default class MultiTagsSelector extends React.Component {
	constructor(props) {
		super(props);

		this.tagSelectChangeHandler = this.tagSelectChangeHandler.bind(this);

		this.state = {
			initialized: false,
			version: 2,
			selectedTags: {
				persontag: null,
				place: null,
				museumtag: null,
				genre: null,
				tags: null
			}
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

	tagSelectChangeHandler(event) {
		var selectedTags = this.state.selectedTags;

		if (selectedTags[event.searchParam] && selectedTags[event.searchParam] == event.value) {
			selectedTags[event.searchParam] = null;
		}
		else {
			selectedTags[event.searchParam] = event.value;
		}

		this.setState({
			selectedTags: selectedTags
		}, function() {
			this.updateRoute();
		}.bind(this));
	}

	updateRoute() {
		var selectedTags = this.state.selectedTags;

		var route = [];

		for (var key in selectedTags) {
			if (selectedTags[key]) {
				route.push(key+'/'+selectedTags[key]);
			}
		}

		hashHistory.push('/search/'+route.join('/'));
	}

	componentWillReceiveProps(props) {
	}

	render() {
		var versionButtons = <div>
			<br/><br/><br/>
			<button onClick={function() {this.setState({version: 1})}.bind(this)}>v1</button> <button onClick={function() {this.setState({version: 2})}.bind(this)}>v2</button>
		</div>;

		var selectedTagsButtons = [];

		var selectedTags = this.state.selectedTags;

		for (var key in selectedTags) {
			selectedTagsButtons.push(<span className="button-link">{selectedTags[key]}</span>);
		}

		console.log(selectedTagsButtons);

		if (this.state.version == 1)
			return (
				<div className={'fade-in-component multitags-selector'+(this.state.initialized ? ' initialized' : '')}>


					<div className="row">

						<div className="three columns">
							<h3>Personer</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'personer')} 
								onChange={this.tagSelectChangeHandler}
								dropdownHeaderText="Personer" 
								expandable="true" 
								limit="10" 
								searchParam="persontag" 
								endpoint={config.endpoints.persons} />
						</div>

						<div className="three columns">
							<h3>Platser</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
								onChange={this.tagSelectChangeHandler}
								dropdownHeaderText="Platser" 
								expandable="true" 
								limit="10" 
								searchParam="place" 
								endpoint={config.endpoints.places} />
						</div>

						<div className="three columns">
							<h3>Taggar</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'tags')} 
								onChange={this.tagSelectChangeHandler}
								dropdownHeaderText="Taggar" 
								expandable="true" 
								limit="10" 
								searchParam="tags" 
								endpoint={config.endpoints.tags} />
						</div>

						<div className="three columns">
							<h3>Genre</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'genre')} 
								onChange={this.tagSelectChangeHandler}
								dropdownHeaderText="Genre" 
								expandable="true" 
								limit="10" 
								searchParam="genre" 
								endpoint={config.endpoints.genres} />
						</div>

					</div>

				</div>
			);
		if (this.state.version == 2)
			return (
				<div className={'fade-in-component multitags-selector'+(this.state.initialized ? ' initialized' : '')}>

					<div className="selected-tags">{selectedTagsButtons}</div>
					<div className="row">

						<div className="twelve columns">
							<h3>Personer</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'personer')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Personer" 
								dropdownButtonLabel="Fler personer"
								expandable={true} 
								limit={30} 
								searchParam="persontag" 
								endpoint={config.endpoints.persons} />

							<br/><br/>
						</div>

					</div>

					<div className="row">

						<div className="four columns">
							<h3>Samling</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'museum')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Samling" 
								expandable={false} 
								limit={10} 
								searchParam="museumtag" 
								endpoint={config.endpoints.museums} />
						</div>

						<div className="four columns">
							<h3>Platser</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Platser" 
								expandable={false} 
								limit={10} 
								searchParam="place" 
								endpoint={config.endpoints.places} />
						</div>

						<div className="four columns">
							<h3>Taggar</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'tags')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Taggar" 
								expandable={false} 
								limit={10} 
								searchParam="tags" 
								endpoint={config.endpoints.tags} />
						</div>

					</div>

					<div className="row">

						<div className="twelve columns">
							<h3>Genre</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'genre')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Genre" 
								expandable={false} 
								limit={10} 
								searchParam="genre" 
								endpoint={config.endpoints.genres} />
						</div>

					</div>

				</div>
			);
	}
}