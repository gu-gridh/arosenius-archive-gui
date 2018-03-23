import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import Masonry  from 'react-masonry-component';
import * as scale from 'd3-scale';

import ImageList from './ImageList';

import WindowScroll from './../utils/window-scroll';

import config from './../config';

export default class Timeline extends React.Component {
	constructor(props) {
		super(props);

		window.timeline = this;

		this.yearLabelClickHandler = this.yearLabelClickHandler.bind(this);
		this.yearSelectChangeHandler = this.yearSelectChangeHandler.bind(this);
		this.yearLabelMouseOverHander = this.yearLabelMouseOverHander.bind(this);

		this.windowScrollHandler = this.windowScrollHandler.bind(this);

		this.waitForScrollCheck = false;

		this.state = {
			data: [],
			detailYears: [],
			selectedYear: 0,
			hoveredYear: 0,
			timelineVisible: true,
			fixedTimeline: false
		};
	}

	yearLabelClickHandler(event) {
		var year = event.target.dataset.year || event.currentTarget.dataset.year;

		this.selectYear(year);
	}

	yearSelectChangeHandler(event) {
		var year = event.target.value;

		console.log(year);

		this.selectYear(year);
	}

	selectYear(year) {
		this.setState({
			selectedYear: year
		});

		document.getElementsByClassName('year-'+year)[0].scrollIntoView();
	}

	yearLabelMouseOverHander(event) {
		var year = event.currentTarget.dataset.year;

		var itemIndex = _.findIndex(this.state.data, function(item) {
			return item.year == year;
		});

		var hoveredYear;

		if (year % 10 == 0 || year == this.state.data[0].year) {
			hoveredYear = year;
		}
		else {
			var nextDecade;

			for (var i = itemIndex; i >= 0; i--) {
				if ((this.state.data[i].year % 10 == 0 || i == 0) && !nextDecade) {
					nextDecade = this.state.data[i].year;
				}
			}

			hoveredYear = nextDecade;
		}

		var gotAll = false;
		var nextYears = _.filter(this.state.data, function(item) {
			if (item.year > hoveredYear && item.year % 10 == 0) {
				gotAll = true;
			}

			return item.year >= hoveredYear && !gotAll;
		});

		this.setState({
			detailYears: nextYears,
			hoveredYear: hoveredYear
		});
	}

	componentDidMount() {
		window.addEventListener('scroll', this.windowScrollHandler);

		this.windowScrollHandler();

		this.scrollCheckInterval = setInterval(this.checkScroll.bind(this), 500);

		this.handleProps(this.props, true);

		this.positionTimeline();
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.windowScrollHandler);

		clearInterval(this.scrollCheckInterval);
	}

	isInViewport(el, onlyConsiderTop, margin) {
		var elemTop = el.getBoundingClientRect().top;
		var elemBottom = el.getBoundingClientRect().bottom;

		if (onlyConsiderTop) {
			var isVisible = elemTop+(margin ? margin : 0) < window.innerHeight;
		}
		else {
			var isVisible = elemTop < window.innerHeight && elemBottom >= 100;
		}

		return isVisible;
	}

	windowScrollHandler() {
		this.scrollChanged = true;
	}

	positionTimeline() {
		if (this.refs.container) {
			var containerTop = this.refs.container.getBoundingClientRect().top;
			var windowHeight = document.documentElement.clientHeight;

			this.setState({
				fixedTimeline: containerTop < 0
			});
		}
	}

	checkScroll() {
		if (!this.scrollChanged) {
			return;
		}

		if (!this.waitForScrollCheck) {
			for (var i = 0; i<this.refs.galleryContainer.children.length; i++) {
				var yearElement = this.refs.galleryContainer.children[i];
				if (this.isInViewport(yearElement)) {
					this.setState({
						selectedYear: yearElement.dataset.year
					});

					break;
				}
			}

			this.waitForScrollCheck = true;

			setTimeout(function() {
				this.waitForScrollCheck = false;
			}.bind(this), 1000);

			this.positionTimeline();
	
			this.scrollChanged = false;
		}
	}

	componentWillReceiveProps(props) {
		this.handleProps(props);
	}

	handleProps(props, force) {
		if (!props.searchString && !props.searchPerson && !props.searchPlace && !props.searchMuseum && !props.searchGenre && !props.searchTags && !props.searchType && !props.searchHue && !props.searchSaturation && this.state.data.length == 0) {
			this.waitingForLoad = true;

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

			this.props.searchSaturation != props.searchSaturation || force
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

//			var windowScroll = new WindowScroll();
//			windowScroll.scrollToY(windowScroll.getOffsetTop(this.refs.galleryContainer)-250, 1000, 'easeInOutSine');
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

		}

		fetch(config.apiUrl+config.endpoints.year_range+(fetchParams.length > 0 ? '?'+fetchParams.join('&') : ''))
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({
					data: json
				}, function() {
					this.forceUpdate();
					console.log('forcing an update');
					}.bind(this));
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	render() {
		var yearGalleries = this.state.data.map(function(item) {
			return <div key={item.year} data-year={item.year} className={'year-item year-'+item.year}>
				<h3>{item.year}</h3>
				<ImageList year={item.year} archiveMaterial="exclude" 
					lazyLoad={true}
					forceUpdate={true}
					searchString={this.props.searchString}
					searchPerson={this.props.searchPerson}
					searchPlace={this.props.searchPlace}
					searchMuseum={this.props.searchMuseum}
					searchGenre={this.props.searchGenre}
					searchTags={this.props.searchTags}
					searchType={this.props.searchType}
					searchHue={this.props.searchHue}
					searchSaturation={this.props.searchSaturation} />

				<br/>

				<ImageList title={'Daterade dokument från '+item.year} year={item.year} 
					archiveMaterial="only"
					showDates={true}
					lazyLoad={true}
					forceUpdate={true}
					searchString={this.props.searchString}
					searchPerson={this.props.searchPerson}
					searchPlace={this.props.searchPlace}
					searchMuseum={this.props.searchMuseum}
					searchGenre={this.props.searchGenre}
					searchTags={this.props.searchTags}
					searchType={this.props.searchType}
					searchHue={this.props.searchHue}
					searchSaturation={this.props.searchSaturation} />

				<br/><br/>

			</div>;
		}.bind(this));

		var detailYearsMin = _.min(this.state.detailYears, function(item) {
			return item.doc_count;
		}).doc_count;

		var detailYearsMax = _.max(this.state.detailYears, function(item) {
			return item.doc_count;
		}).doc_count;

		var fontSize = scale.scaleLinear().domain([detailYearsMin, detailYearsMax]);

		return <div className="timeline-view" ref="container">

			<div className={'timeline-year-select'+(this.state.fixedTimeline ? ' fixed' : '')}>
				<select onChange={this.yearSelectChangeHandler}>
					{
						this.state.data.map(function(item, index) {
							return <option key={item.year} value={item.year}>{item.year+' ('+item.doc_count+')'}</option>;
						})
					}
				</select>
			</div>

			<div className={'timeline-year-list'+(this.state.timelineVisible ? ' visible' : '')+(this.state.fixedTimeline ? ' fixed' : '')}>

				{
					this.state.data.map(function(item, index) {
						var docPoints = [];

						for (var i = 0; i<item.doc_count; i++) {
							docPoints.push(<span className="point" key={i} />);
						}

						return <a key={item.year}
							data-year={item.year}
							onClick={this.yearLabelClickHandler} 
							onMouseOver={this.yearLabelMouseOverHander}
							className={'year-item'+(item.year == this.state.selectedYear && _.findIndex(this.state.detailYears, function(detailYear) { return detailYear.year == item.year}) == -1 ? ' selected' : '')+(item.year % 10 != 0 && index > 0 ? ' dot-item' : '')}
						>
							<span className={'year-label'}>
								<span>{item.year}</span>
							</span>

							{
								this.state.hoveredYear == item.year &&
								<div className={'detail-years'}>
									{
										this.state.detailYears.map(function(detailItem, index) {
											return <span data-year={detailItem.year} 
												onClick={this.yearLabelClickHandler} 
												className={'detail-item'+(detailItem.year == this.state.selectedYear ? ' selected' : '')} 
												style={{fontSize: (fontSize(detailItem.doc_count)*10)+10}} 
												key={detailItem.year}
											>{detailItem.year}</span>
										}.bind(this))
									}
								</div>
							}

						</a>;
					}.bind(this))
				}

			</div>

			<div className="gallery-container" ref="galleryContainer">

				{yearGalleries}

			</div>
		</div>;
	}
}
