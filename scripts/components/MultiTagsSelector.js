import React from 'react';
import { hashHistory } from 'react-router';
import Masonry  from 'react-masonry-component';

import config from './../config';

import _ from 'underscore';

import TagsSelector from './TagsSelector';

export default class MultiTagsSelector extends React.Component {
	constructor(props) {
		super(props);

		this.tagSelectChangeHandler = this.tagSelectChangeHandler.bind(this);
		this.searchModeChangedHandler = this.searchModeChangedHandler.bind(this);
		this.tagRemoveButtonClickHandler = this.tagRemoveButtonClickHandler.bind(this);
		this.tagListLoadHandler = this.tagListLoadHandler.bind(this);

		this.state = {
			initialized: false,
			selectedTags: {
				person: this.props.person || null,
				place: this.props.place || null,
				museum: this.props.museum || null,
				genre: this.props.genre || null,
				tags: this.props.tags || null,
				type: this.props.type || null
			},
			version: 3
		};

		window.eventBus.addEventListener('search.mode-changed', this.searchModeChangedHandler);
	}

	componentDidMount() {
		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 300);

	}

	searchModeChangedHandler() {
		this.setState({
			selectedTags: {
				person: null,
				place: null,
				museum: null,
				genre: null,
				tags: null,
				type: null
			}
		});
	}

	onDropdownOpen(dropDownName) {
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

	tagRemoveButtonClickHandler(event) {
		var selectedTags = this.state.selectedTags;

		selectedTags[event.currentTarget.dataset.tagname] = null;

		this.setState({
			selectedTags: selectedTags
		}, function() {
			this.updateRoute();
		}.bind(this));
	}

	tagListLoadHandler() {
		if (this.refs.masonry) {
			this.refs.masonry.performLayout();
		}
	}

	updateRoute() {
		var selectedTags = this.state.selectedTags;

		var route = [];

		for (var key in selectedTags) {
			if (selectedTags[key] && selectedTags[key] != '') {
				route.push(key+'/'+selectedTags[key]);
			}
		}

		hashHistory.push('/search/tags/'+route.join('/'));
	}

	componentWillReceiveProps(props) {
		this.setState({
			selectedTags: {
				person: props.person || null,
				place: props.place || null,
				museum: props.museum || null,
				genre: props.genre || null,
				tags: props.tags || null,
				type: props.type || null
			}
		});
	}

	personTagSort(x, y) {
		var sortOrder = ['Arosenius', 'Eva', 'Adler', 'Kruse', 'Henning', 'Sahlin'];
	}

	render() {

		var selectedTagsButtons = [];

		var selectedTags = this.state.selectedTags;

		for (var key in selectedTags) {
			if (selectedTags[key]) {
				selectedTagsButtons.push(<span key={selectedTags[key]} className="button-link" onClick={this.tagRemoveButtonClickHandler} data-tagname={key}>{selectedTags[key]}<span className="remove-button" dangerouslySetInnerHTML={{__html: '&#xd7'}} /></span>);
			}
		}

		return (
			<div className={'fade-in-component multitags-selector'+(this.state.initialized ? ' initialized' : '')}>

				{
					this.state.version == 1 &&
					<Masonry ref="masonry" className={'tags-grid'} options={{columnWidth: '.grid-sizer', percentPosition: true}} >

						<div className="grid-sizer width-33"></div>

						<div className="tags-container">
							<h3>Samlingar</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'museum')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Samling" 
								expandable={false} 
								limit={10} 
								searchParam="museum" 
								selectedTag={this.state.selectedTags.museum}
								endpoint={config.endpoints.museums}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="tags-container width-33">
							<h3>Personer</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'personer')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Personer" 
								dropdownButtonLabel="Fler personer"
								expandable={true} 
								limit={50} 
								searchParam="person" 
								selectedTag={this.state.selectedTags.person}
								endpoint={config.endpoints.persons}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="tags-container width-33">
							<h3>Platser</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Platser" 
								expandable={false} 
								limit={20} 
								searchParam="place" 
								selectedTag={this.state.selectedTags.place}
								endpoint={config.endpoints.places}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="tags-container width-33">
							<h3>Kategorier</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Kategori" 
								expandable={false} 
								limit={20} 
								searchParam="type" 
								selectedTag={this.state.selectedTags.type}
								endpoint={config.endpoints.types}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="tags-container width-33">
							<h3>Genrer</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'genre')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Genre"
								dropdownButtonLabel="Fler genre" 
								expandable={false} 
								limit={18} 
								selectedTag={this.state.selectedTags.genre}
								searchParam="genre" 
								endpoint={config.endpoints.genres}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="tags-container width-33">
							<h3>Taggar</h3>
							<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'tags')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Taggar" 
								expandable={true} 
								limit={60} 
								searchParam="tags" 
								selectedTag={this.state.selectedTags.tags}
								endpoint={config.endpoints.tags}
								onLoad={this.tagListLoadHandler} />
						</div>

					</Masonry>
				}
				{
					this.state.version == 2 &&
					<div className="tags-grid grid-columns">

						<div className="tags-column">
							<div className="tags-container">
								<h3>Samlingar</h3>
								<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'museum')} 
									onSelect={this.tagSelectChangeHandler}
									dropdownHeaderText="Samling" 
									expandable={false} 
									limit={10} 
									searchParam="museum" 
									selectedTag={this.state.selectedTags}
									endpoint={config.endpoints.museums}
									onLoad={this.tagListLoadHandler} />
							</div>

							<div className="tags-container">
								<h3>Kategorier</h3>
								<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
									onSelect={this.tagSelectChangeHandler}
									dropdownHeaderText="Kategori" 
									expandable={false} 
									limit={10} 
									searchParam="type" 
									selectedTag={this.state.selectedTags}
									endpoint={config.endpoints.types}
									onLoad={this.tagListLoadHandler} />
							</div>

							<div className="tags-container">
								<h3>Taggar</h3>
								<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'tags')} 
									onSelect={this.tagSelectChangeHandler}
									dropdownHeaderText="Taggar" 
									dropdownButtonLabel="Fler taggar"
									expandable={true} 
									limit={60} 
									searchParam="tags" 
									selectedTag={this.state.selectedTags}
									endpoint={config.endpoints.tags}
									onLoad={this.tagListLoadHandler} />
							</div>

						</div>
						<div className="tags-column">

							<div className="tags-container">
								<h3>Personer</h3>
								<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'personer')} 
									onSelect={this.tagSelectChangeHandler}
									dropdownHeaderText="Personer" 
									dropdownButtonLabel="Fler personer"
									expandable={true} 
									limit={50} 
									searchParam="person" 
									selectedTag={this.state.selectedTags}
									endpoint={config.endpoints.persons}
									onLoad={this.tagListLoadHandler} />
							</div>

						</div>
						<div className="tags-column">

							<div className="tags-container">
								<h3>Platser</h3>
								<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
									onSelect={this.tagSelectChangeHandler}
									dropdownHeaderText="Platser" 
									expandable={false} 
									limit={20} 
									searchParam="place" 
									selectedTag={this.state.selectedTags}
									endpoint={config.endpoints.places}
									onLoad={this.tagListLoadHandler} />
							</div>

							<div className="tags-container">
								<h3>Genrer</h3>
								<TagsSelector onDropdownOpen={this.onDropdownOpen.bind(this, 'genre')} 
									onSelect={this.tagSelectChangeHandler}
									dropdownHeaderText="Genre"
									dropdownButtonLabel="Fler genre" 
									expandable={false} 
									limit={18} 
									selectedTag={this.state.selectedTags}
									searchParam="genre" 
									endpoint={config.endpoints.genres}
									onLoad={this.tagListLoadHandler} />
							</div>

						</div>

						<div className="u-cf" />

					</div>					
				}
				{
					this.state.version == 3 &&
					<div className="tags-columns">

						<div className="tags-container">
							<TagsSelector title="Samlingar" 
								onDropdownOpen={this.onDropdownOpen.bind(this, 'museum')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Samlingar" 
								dropdownButtonLabel="Fler"
								expandable={false} 
								limit={5} 
								searchParam="museum" 
								selectedTag={this.state.selectedTags}
								endpoint={config.endpoints.museums}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="tags-container">
							{/* Typer */}
							<TagsSelector title="Kategorier" onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Typer" 
								dropdownButtonLabel="Fler"
								expandable={false} 
								limit={8} 
								searchParam="type" 
								selectedTag={this.state.selectedTags}
								endpoint={config.endpoints.types}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="u-cf divider-2" />

						<div className="tags-container">
							{/* Genrer */}
							<TagsSelector title="Underkategorier" onDropdownOpen={this.onDropdownOpen.bind(this, 'genre')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Underkategorier"
								dropdownButtonLabel="Fler"
								expandable={true} 
								limit={10} 
								selectedTag={this.state.selectedTags}
								searchParam="genre" 
								endpoint={config.endpoints.genres}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="u-cf divider-1" />

						<div className="tags-container">
							<TagsSelector title="Personer" onDropdownOpen={this.onDropdownOpen.bind(this, 'personer')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Personer" 
								dropdownButtonLabel="Fler"
								expandable={true} 
								limit={7} 
								dropdownItemsSortFunc={function(a, b) {
									var aFrags = a.value.split(' ');
									var bFrags = b.value.split(' ');

									if (aFrags[aFrags.length-1] < bFrags[bFrags.length-1]) return -1;
									if (bFrags[bFrags.length-1] < aFrags[aFrags.length-1]) return 1;
									return 0;
								}}
								searchParam="person" 
								selectedTag={this.state.selectedTags}
								endpoint={config.endpoints.persons}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="u-cf divider-2" />

						<div className="tags-container">
							<TagsSelector title="Platser" onDropdownOpen={this.onDropdownOpen.bind(this, 'ort')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Platser" 
								dropdownButtonLabel="Fler"
								expandable={true} 
								limit={12} 
								searchParam="place" 
								selectedTag={this.state.selectedTags}
								endpoint={config.endpoints.places}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="tags-container">
							<TagsSelector title="Taggar" onDropdownOpen={this.onDropdownOpen.bind(this, 'tags')} 
								onSelect={this.tagSelectChangeHandler}
								dropdownHeaderText="Taggar" 
								dropdownButtonLabel="Fler"
								expandable={true} 
								limit={13} 
								searchParam="tags" 
								selectedTag={this.state.selectedTags}
								endpoint={config.endpoints.tags}
								onLoad={this.tagListLoadHandler} />
						</div>

						<div className="u-cf" />

					</div>					
				}

				{
					selectedTagsButtons.length > 0 &&
					<div className="selected-tags">{selectedTagsButtons}</div>
				}

			</div>
		);
	}
}