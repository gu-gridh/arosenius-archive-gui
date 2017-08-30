import React from 'react';

import config from './../config';

import _ from 'underscore';

import TagsSelector from './TagsSelector';

export default class MultiTagsSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialized: false,
			version: 2
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
		var versionButtons = <div>
			<br/><br/><br/>
			<button onClick={function() {this.setState({version: 1})}.bind(this)}>v1</button> <button onClick={function() {this.setState({version: 2})}.bind(this)}>v2</button>
		</div>;

		if (this.state.version == 1)
			return (
				<div className={'fade-in-component multitags-selector'+(this.state.initialized ? ' initialized' : '')}>

					<div className="row">

						<div className="three columns">
							<h3>Personer</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'personer')} 
								dropdownHeaderText="Personer" 
								expandable="true" 
								limit="10" 
								searchParam="persontag" 
								endpoint={config.endpoints.persons} />
						</div>

						<div className="three columns">
							<h3>Platser</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
								dropdownHeaderText="Platser" 
								expandable="true" 
								limit="10" 
								searchParam="place" 
								endpoint={config.endpoints.places} />
						</div>

						<div className="three columns">
							<h3>Taggar</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'tags')} 
								dropdownHeaderText="Taggar" 
								expandable="true" 
								limit="10" 
								searchParam="tags" 
								endpoint={config.endpoints.tags} />
						</div>

						<div className="three columns">
							<h3>Genre</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'genre')} 
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

					<div className="row">

						<div className="twelve columns">
							<h3>Personer</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'personer')} 
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
							<h3>Platser</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
								dropdownHeaderText="Platser" 
								expandable={false} 
								limit={10} 
								searchParam="place" 
								endpoint={config.endpoints.places} />
						</div>

						<div className="four columns">
							<h3>Taggar</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'tags')} 
								dropdownHeaderText="Taggar" 
								expandable={false} 
								limit={10} 
								searchParam="tags" 
								endpoint={config.endpoints.tags} />
						</div>

						<div className="four columns">
							<h3>Genre</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'genre')} 
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