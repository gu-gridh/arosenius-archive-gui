import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import Masonry  from 'react-masonry-component';

import ImageList from './ImageList';

import config from './../config';

export default class Timeline extends React.Component {
	constructor(props) {
		super(props);

		window.timeline = this;

		this.yearLabelClickHandler = this.yearLabelClickHandler.bind(this);

		this.state = {
			data: []
		};
	}

	yearLabelClickHandler(event) {
		var year = event.currentTarget.dataset.year;

		document.getElementsByClassName('year-'+year)[0].scrollIntoView();
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	componentWillReceiveProps(props) {
		if (!props.searchString && !props.searchPerson && !props.searchPlace && !props.searchMuseum && !props.searchGenre && !props.searchTags && !props.searchType && !props.searchHue && !props.searchSaturation && this.state.data.length == 0) {
			this.waitingForLoad = true;

			//this.collection.fetch(null, props.count, 1);

			this.fetchYears();
		}
		else if (this.props.searchString != props.searchString || 
			this.props.searchPerson != props.searchPerson || 
			this.props.searchPlace != props.searchPlace || 
			this.props.searchMuseum != props.searchMuseum ||
			this.props.searchGenre != props.searchGenre ||
			this.props.searchTags != props.searchTags ||
			this.props.searchType != props.searchType ||
			this.props.searchHue != props.searchHue ||
			
			this.props.searchSaturation != props.searchSaturation
		) {
			this.waitingForLoad = true;

			this.setState({
				loading: true
			});

			this.fetchYears({
				searchString: props.searchString, 
				person: props.searchPerson, 
				place: props.searchPlace, 
				museum: props.searchMuseum, 
				genre: props.searchGenre, 
				tags: props.searchTags,
				type: props.searchType, 
				hue: props.searchHue, 
				saturation: props.searchSaturation
			});
		}
	}

	fetchYears(params) {
		var fetchParams = [];

		if (params) {
			if (params.searchString) {
				fetchParams.push('search='+params.searchString);
			}
			if (params.person && params.person != '') {
				fetchParams.push('person='+(params.person.join ? params.person.join(';') : params.person));
			}
			if (params.place && params.place != '') {
				fetchParams.push('place='+params.place);
			}
			if (params.museum && params.museum != '') {
				fetchParams.push('museum='+params.museum);
			}
			if (params.genre && params.genre != '') {
				fetchParams.push('genre='+params.genre);
			}
			if (params.tags && params.tags != '') {
				fetchParams.push('tags='+params.tags);
			}
			if (params.type && params.type != '') {
				fetchParams.push('type='+params.type);
			}
			if (params.hue && params.hue != '') {
				fetchParams.push('hue='+params.hue);
			}
			if (params.saturation && params.saturation != '') {
				fetchParams.push('saturation='+params.saturation);
			}

			if (params.hue || params.saturation) {
				fetchParams.push('archivematerial=exclude');
			}
		}

		fetch(config.apiUrl+config.endpoints.year_range+(fetchParams.length > 0 ? '?'+fetchParams.join('&') : ''))
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({
					data: json
				}, function() {
					this.forceUpdate();
				}.bind(this));
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	render() {
		var yearGalleries = this.state.data.map(function(item) {
			return <div key={item.year} className={'year-'+item.year}>
				<h3>{item.year}</h3>
				<ImageList year={item.year} 
					lazyLoad={true} 
					searchString={this.props.searchString}
					searchPerson={this.props.searchPerson}
					searchPlace={this.props.searchPlace}
					searchMuseum={this.props.searchMuseum}
					searchGenre={this.props.searchGenre}
					searchTags={this.props.searchTags}
					searchType={this.props.searchType}
					searchHue={this.props.searchHue}
					searchSaturation={this.props.searchSaturation}
				/>
			</div>;
		}.bind(this));

		return <div className="timeline-view">
			<div className="timeline-year-list">
				{
					this.state.data.map(function(item) {
						var docPoints = [];

						for (var i = 0; i<item.doc_count; i++) {
							docPoints.push(<span className="point" key={i} />);
						}

						return <a key={item.year} className="year-item">
							<span className="year-label" data-year={item.year} onClick={this.yearLabelClickHandler}>{item.year}</span>
							{<span className="doc-points">
								{
									docPoints
								}
							</span>}
						</a>;
					}.bind(this))
				}
			</div>

			<div className="gallery-container">

				{yearGalleries}

			</div>
		</div>;
	}
}