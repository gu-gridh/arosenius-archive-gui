import React from 'react';

import _ from 'underscore';

export default class ThumbnailCircles
 extends React.Component {
	constructor(props) {
		super(props);

		window.thumbs = this;

		this.state = {
			selectedPersons: [],
			initialized: false
		};

		this.thumbnailClick = this.thumbnailClick.bind(this);

		this.thumbnails = [
			{
				image: 'img/persons/ivar.jpg',
				label: 'Ivar Arosenius'
			},
			{
				image: 'img/persons/lillan.jpg',
				label: 'Eva "Lillan" Arosenius'
			},
			{
				image: 'img/persons/eva.jpg',
				label: 'Ida (Eva) Arosenius'
			},
			{
				image: 'img/persons/kruse.jpg',
				label: 'Ole Kruse'
			},
			{
				image: 'img/persons/henning.jpg',
				label: 'Gerhard Henning'
			},
			{
				image: 'img/persons/sahlin.jpg',
				label: 'Ester Sahlin'
			}
		];
	}

	thumbnailClick(index) {
		var selectedPersons = this.state.selectedPersons;

		if (_.indexOf(selectedPersons, this.thumbnails[index].label) == -1) {
			selectedPersons.push(this.thumbnails[index].label);
		}
		else {
			selectedPersons = _.without(selectedPersons, this.thumbnails[index].label);
		}

		this.setState({
			selectedPersons: selectedPersons
		}, function() {
			if (this.props.selectionChanged) {
				this.props.selectionChanged({
					selectedPersons: this.state.selectedPersons
				});
			}
		}.bind(this));
	}

	componentDidMount() {
		this.setState({
			selectedPersons: this.props.selectedPersons
		});

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 300);

	}

	componentWillReceiveProps(props) {
		this.setState({
			selectedPersons: props.selectedPersons
		})
	}

	render() {
		var items = this.thumbnails.map(function(item, index) {
			return <a onClick={function(e) {e.preventDefault(); this.thumbnailClick(index)}.bind(this)} key={index} href="#" className={"thumb-item"+(_.indexOf(this.state.selectedPersons, item.label) > -1 ? ' selected' : '')} style={{backgroundImage: 'url('+item.image+')'}}>
				<span>{item.label}</span>
			</a>
		}.bind(this));
		return (
			<div className={'fade-in-component thumb-list'+(this.state.initialized ? ' initialized' : '')}>
				{items}
			</div>
		)
	}
}