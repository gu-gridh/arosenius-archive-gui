import React from 'react';
import * as scale from 'd3-scale';
import _ from 'underscore';

import Header from './Header';
import TagsSelector from './TagsSelector';
import ImageList from './ImageList';

import EventBus from 'eventbusjs';

import config from './../config';

export default class GoogleVisionLabelsViewer extends React.Component {
	constructor(props) {
		super(props);

		window.eventBus = EventBus;

		this.state = {
			selectedType: null,
			selectedLabel: null,
			selectedSecondLabel: null,

			types: [],
			allLabels: [],
			relatedLabels: []
		};

		this.url = config.apiUrl+'googleVisionLabels';

		window.app = this;
	}

	componentDidMount() {
		fetch(config.apiUrl+config.endpoints.types)
			.then(function(response) {
				return response.json();
			}.bind(this)).then(function(json) {
				this.setState({
					types: json
				});
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;

		this.fetchAllLabels();
	}

	fetchAllLabels() {
		fetch(this.url+(this.state.selectedType ? '?type='+this.state.selectedType : ''))
			.then(function(response) {
				return response.json();
			}.bind(this)).then(function(json) {
				this.setState({
					allLabels: json
				});
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	fetchRelatedLabels(label) {
		fetch(this.url+'?google_label='+label+(this.state.selectedType ? '&type='+this.state.selectedType : ''))
			.then(function(response) {
				return response.json();
			}.bind(this)).then(function(json) {
				this.setState({
					relatedLabels: json,
					selectedSecondLabel: null
				});
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;	}

	getLabelStyle(fontSize) {
		return {
			display: 'inline-block',
			margin: '0 10px 0 0',
			fontSize: (fontSize*30)+16,
			cursor: 'pointer'
		};
	}

	getListContainerStyle() {
		return {
			maxHeight: 400,
			overflowY: 'scroll'
		}
	}

	createLabelItems(labels, onClick) {
		var min = _.min(labels, function(item) {
			return item.doc_count;
		}).doc_count;

		var max = _.max(labels, function(item) {
			return item.doc_count;
		}).doc_count;

		var fontSize = scale.scaleLinear().domain([min, max]);

		return labels.length > 0 ? labels.map(function(label) {
			return <a key={label.value} data-label={label.value} style={this.getLabelStyle(fontSize(label.doc_count))} onClick={onClick}>{label.value} <span style={{color: '#fff'}}>({label.doc_count})</span></a>
		}.bind(this)) : [];
	}

	render() {

		var allLabelItems = this.createLabelItems(this.state.allLabels, function(event) {
			event.preventDefault();

			this.fetchRelatedLabels(event.currentTarget.dataset.label);

			this.setState({
				selectedLabel: event.currentTarget.dataset.label
			});
		}.bind(this));

		var relatedLabelItems = this.createLabelItems(this.state.relatedLabels, function(event) {
			event.preventDefault();

			this.setState({
				selectedSecondLabel: event.currentTarget.dataset.label
			});
		}.bind(this));

		return (
			<div>
				<Header routerPath={this.props.location.pathname} smallHeader={true} />
				<div className={'site-content'}>
					<div className="container" style={{marginTop: 50, marginBottom: 50}}>
						<h1>Google Vision Machine Learning</h1>

						{
							this.state.types.length > 0 &&
							<div className={'button-list'}>
								{
									this.state.types.map(function(type) {
										return <a key={type.value} className={'button-link'+(this.state.selectedType == type.value ? ' selected' : '')} onClick={function(event) {
											this.setState({
												selectedType: type.value,
												selectedLabel: null,
												selectedSecondLabel: null,
												relatedLabels: []
											}, function() {
												this.fetchAllLabels();
											}.bind(this))
										}.bind(this)}>{type.value}</a>
									}.bind(this))
								}
							</div>
						}

						<hr />

						<div className="row">
							<div className="six columns">

								<div className="labels-list" style={this.getListContainerStyle()}>
									{allLabelItems}
								</div>

							</div>

							<div className="six columns">

								{
									this.state.relatedLabels.length > 0 &&
									<div className="labels-list" style={this.getListContainerStyle()}>
										{relatedLabelItems}
									</div>
								}

							</div>
						</div>

						{
							(this.state.selectedType || this.state.selectedLabel || this.state.selectedSecondLabel) &&
							<hr />
						}

						{
							this.state.selectedType &&
							<div>Typ: {this.state.selectedType}</div>
						}

						{
							this.state.selectedLabel &&
							<div>Google Label: {this.state.selectedLabel}
							{
								this.state.selectedSecondLabel &&
								<span>, {this.state.selectedSecondLabel}</span>
							}
							</div>
						}

						<hr />

						<ImageList disableScrolling={true} searchType={this.state.selectedType} google_label={(this.state.selectedLabel ? this.state.selectedLabel : '')+(this.state.selectedLabel && this.state.selectedSecondLabel ? ';'+this.state.selectedSecondLabel : '')} />

					</div>
				</div>
			</div>
		)
	}
}
