import React from 'react';
import { hashHistory } from 'react-router';
import _ from 'underscore';

import config from './../config';

export default class AutocompleteDiscoverInput extends React.Component {
	constructor(props) {
		super(props);

		this.inputValueChangeHandler = this.inputValueChangeHandler.bind(this);
		this.inputBlurHandler = this.inputBlurHandler.bind(this);
		this.inputKeyDownHandler = this.inputKeyDownHandler.bind(this);

		this.state = {
			inputValue: props.value || '',
			data: {},
			listIndex: -1
		};
	}

	componentWillReceiveProps(props) {
		if (props.value != this.state.inputValue) {
			var state = {
				inputValue: props.value
			};

			if (props.value == '') {
				state.data = [];
			}

			this.setState(state);
		}
	}

	focus() {
		if (this.refs.input) {
			this.refs.input.focus();
		}
	}

	inputValueChangeHandler(event) {
		event.persist();

		if (event.target.value == '') {
			this.setState({
				inputValue: '',
				data: [],
				listIndex: -1
			});

			if (this.props.onChange) {
				this.props.onChange({
					target: {
						name: this.props.inputName || '',
						value: ''
					}
				});
			}
		}
		else {
			this.setState({
				inputValue: event.target.value
			}, function() {
				if (event.target.value.length > 2) {
					if (this.state.inputValue.indexOf(',') > -1) {
						var inputStrings = this.state.inputValue.split(',');
						var searchValue = inputStrings[inputStrings.length-1];

						if (searchValue != '') {
							this.fetchData(searchValue);
						}
					}
					else {
						this.fetchData(this.state.inputValue);
					}
				}

				if (this.props.onChange) {
					this.props.onChange(event);
				}
			}.bind(this));
		}
	}

	inputKeyDownHandler(event) {
		event.persist();
		if (event.keyCode == 38) { // up
			if (this.state.listIndex > 0) {
				this.setState({
					listIndex: this.state.listIndex-1,
					inputValue: this.assignInputValue(this.props.valueField ? this.state.data[this.state.listIndex-1][this.props.valueField] : this.state.data[this.state.listIndex-1])
				}, function() {
					if (this.props.onChange) {
						this.props.onChange(event);
					}
				}.bind(this));
			}
		}
		if (event.keyCode == 40) { // ner
			if (this.state.listIndex < this.state.data.length) {
				this.setState({
					listIndex: this.state.listIndex+1,
					inputValue: this.assignInputValue(this.props.valueField ? this.state.data[this.state.listIndex+1][this.props.valueField] : this.state.data[this.state.listIndex+1])
				}, function() {
					if (this.props.onChange) {
						this.props.onChange(event);
					}
				}.bind(this));
			}
		}
		if (event.keyCode == 13) { // enter
			this.setState({
				listIndex: -1,
				data: []
			}, function() {
				if (this.props.onEnter) {
					this.props.onEnter();
				}
			}.bind(this));
		}

	}

	inputBlurHandler() {
		return;
		setTimeout(function() {
			this.setState({
				data: [],
				listIndex: -1
			});
		}.bind(this), 200);
	}

	assignInputValue(value) {
		var inputValue = this.state.inputValue;

		var ret = '';

		if (inputValue.indexOf(',') > -1) {
			var inputValues = inputValue.split(',');
			inputValues[inputValues.length-1] = value;

			ret = inputValues.join(',');
		}
		else {
			ret = value;
		}
		return ret;
	}

	itemClickHandler(item, route, valueField) {
		if (route && !this.props.defaultAction == 'setValue') {
			hashHistory.push(route+(valueField ? item[valueField] : item.key));
		}
		else {
			this.setState({
				inputValue: item.key
			}, function() {
				if (this.props.onChange) {
					this.props.onChange({
						target: {
							name: this.props.inputName || '',
							value: this.state.inputValue
						},
						triggerSearch: true
					});
				}
			}.bind(this));
		}

		return;

		this.setState({
			inputValue: this.assignInputValue(item)
		}, function() {
			if (this.props.onChange) {
				this.props.onChange({
					target: {
						name: this.props.inputName || '',
						value: this.state.inputValue
					}
				});
			}
		}.bind(this));
	}

	fetchData(str) {
		if (this.waitingForFetch || (this.props.minChars && str.length < this.props.minChars)) {
			return;
		}

		this.waitingForFetch = true;

		fetch(config.apiUrl+config.endpoints.autocomplete+'?search='+str)
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				this.setState({
					data: json,
					listIndex: -1
				});
				this.waitingForFetch = false;
			}.bind(this))
			.catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	render() {
		var getBucketElements = function(field) {
			var elements = this.state.data[field].map(function(item, index) {
				return <div className={'item'+(this.state.listIndex == index ? ' selected' : '')} 
					key={field+index} 
					onClick={this.itemClickHandler.bind(this, item.key)}>
					{
						item.key+' ('+item.doc_count+')'
					}
				</div>
			}.bind(this));

			return elements;
		}.bind(this);

		var items = [];

		if (this.state.data.documents) {
			items = _.union(items, getBucketElements('documents'));
		}
		if (this.state.data.tags) {
			items = _.union(items, getBucketElements('tags'));
		}
		if (this.state.data.persons) {
			items = _.union(items, getBucketElements('persons'));
		}
		if (this.state.data.places) {
			items = _.union(items, getBucketElements('places'));
		}

		var getListElements = function(field, route, valueField) {
			return this.state.data[field].map(function(item, index) {
				return <span className="item-wrapper" key={field+index} >
					<a href={'#'+route+item.key} className={'item'+(this.state.listIndex == index ? ' selected' : '')} >
						{
							item.key.length > 35 ? item.key.substr(0, 35)+'...' : item.key
						}
					</a>
				</span>;
			}.bind(this))
		}.bind(this);

		return <div ref="container" className="autocomplete-input">
			<input ref="input" 
				className={this.props.inputClassName} 
				type="text" 
				name={this.props.inputName || ''} 
				placeholder={this.props.placeholder}
				value={this.state.inputValue} 
				onChange={this.inputValueChangeHandler}
				onBlur={this.inputBlurHandler}
				onKeyDown={this.inputKeyDownHandler}
				onKeyPress={function(event) {
					if (this.props.onKeyPress) {
						this.props.onKeyPress(event);
					}
				}.bind(this)} />
			<div className={'autocomplete-tags'+(this.state.data && items && items.length > 0 ? ' visible' : '')}>
				{
					/*
					this.state.data.documents && this.state.data.documents.length > 0 &&
					<div className="tags-list">
						<h4>Titlar</h4>
						{
							getListElements('documents', '/image/', 'id')
						}
					</div>
					*/
				}
				{
					this.state.data.persons && this.state.data.persons.length > 0 &&
					<div className="tags-list">
						<span className="tag-name">Personer </span>
						{
							getListElements('persons', '/search/tags/person/')
						}
					</div>
				}
				{
					this.state.data.places && this.state.data.places.length > 0 &&
					<div className="tags-list">
						<span className="tag-name">Platser </span>
						{
							getListElements('places', '/search/tags/place/')
						}
					</div>
				}
				{
					this.state.data.tags && this.state.data.tags.length > 0 &&
					<div className="tags-list">
						<span className="tag-name">Taggar </span>
						{
							getListElements('tags', '/search/tags/tags/')
						}
					</div>
				}
				{
					this.state.data.type && this.state.data.type.length > 0 &&
					<div className="tags-list">
						<span className="tag-name">Kategorier </span>
						{
							getListElements('type', '/search/tags/type/')
						}
					</div>
				}
				{
					this.state.data.genre && this.state.data.genre.length > 0 &&
					<div className="tags-list">
						{/*<span className="tag-name">Genre </span>*/}
						<span className="tag-name">Underkategorier </span>
						{
							getListElements('genre', '/search/tags/genre/')
						}
					</div>
				}
				{
					this.state.data.museum && this.state.data.museum.length > 0 &&
					<div className="tags-list">
						<span className="tag-name">Samlingar </span>
						{
							getListElements('museum', '/search/tags/museum/')
						}
					</div>
				}
			</div>
		</div>
	}
}