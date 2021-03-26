import React from 'react';
import { hashHistory } from 'react-router';
import _ from 'underscore';

export default class SearchAutocompleteInput extends React.Component {
	constructor(props) {
		super(props);

		this.inputValueChangeHandler = this.inputValueChangeHandler.bind(this);
		this.inputBlurHandler = this.inputBlurHandler.bind(this);
		this.inputKeyDownHandler = this.inputKeyDownHandler.bind(this);

		this.state = {
			inputValue: props.value || '',
			data: [],
			listIndex: -1
		};
	}

	componentWillReceiveProps(props) {
		if (props.value != this.state.inputValue) {
			this.setState({
				inputValue: props.value
			});
		}
	}

	focus() {
		this.refs.textInput.focus();
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

	itemClickHandler(item) {		
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

		fetch(this.props.searchUrl.replace('$s', str))
			.then(function(response) {
				return response.json()
			})
			.then(function(json) {
				var data = json.titles;

				data = data.concat(json.tags);
				data = data.concat(json.persons);
				data = data.concat(json.places);

				data = _.uniq(data, function(item) {
					return item.key
				});

				this.setState({
					data: data,
//					data: json[this.props.dataField || 'data'],
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
		var items = this.state.data.map(function(item, index) {
			return <div className={'item'+(this.state.listIndex == index ? ' selected' : '')} 
				key={index} 
				onClick={this.itemClickHandler.bind(this, this.props.valueField ? item[this.props.valueField] : item)}>
				{
					this.props.listLabelFormatFunc ? this.props.listLabelFormatFunc(item) : this.props.valueField ? item[this.props.valueField] : item
				}
			</div>
		}.bind(this));
		return <div ref="container" className="autocomplete-input">
			<input ref="textInput" 
				className={this.props.inputClassName} 
				type="text" 
				name={this.props.inputName || ''}
				value={this.state.inputValue} 
				placeholder={this.props.placeholder}
				onChange={this.inputValueChangeHandler}
				onBlur={this.inputBlurHandler}
				onKeyDown={this.inputKeyDownHandler}
				onKeyPress={function(event) {
					if (this.props.onKeyPress) {
						this.props.onKeyPress(event);
					}
				}.bind(this)} />
			{
				items.length > 0 &&
				<div className="autocomplete-list">
					{items}
				</div>
			}
		</div>
	}
}
