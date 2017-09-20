import React from 'react';

import _ from 'underscore';

export default class ThumbnailCircles
 extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedPersons: [],
			initialized: false
		};

		this.thumbnailClick = this.thumbnailClick.bind(this);

		this.thumbnails = [
			{
				image: 'img/persons/ivar.jpg',
				label: 'Ivar Arosenius',
				shortLabel: 'Ivar'
			},
			{
				image: 'img/persons/lillan.jpg',
				label: 'Eva "Lillan" Arosenius',
				shortLabel: 'Lillan'
			},
			{
				image: 'img/persons/eva.jpg',
				label: 'Ida (Eva) Arosenius',
				shortLabel: 'Eva'
			},
			{
				image: 'img/persons/kruse.jpg',
				label: 'Ole Kruse',
				shortLabel: 'Ole'
			},
			{
				image: 'img/persons/henning.jpg',
				label: 'Gerhard Henning',
				shortLabel: 'Gerhard'
			},
			{
				image: 'img/persons/sahlin.jpg',
				label: 'Ester Sahlin',
				shortLabel: 'Ester'
			}
		];
	}

	thumbnailClick(index) {
		var selectedPersons = this.state.selectedPersons || [];

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
			selectedPersons: this.props.selectedPersons ? this.props.selectedPersons.split(';') : []
		});

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 300);

	}

	componentWillReceiveProps(props) {
		this.setState({
			selectedPersons: props.selectedPersons ? (props.selectedPersons.split ? props.selectedPersons.split(';') : props.selectedPersons) : []
		})
	}

	render() {
		var items = this.thumbnails.map(function(item, index) {
			return <a onClick={function(e) {e.preventDefault(); this.thumbnailClick(index)}.bind(this)} key={index} href="#" className={"thumb-item"+(_.indexOf(this.state.selectedPersons, item.label) > -1 ? ' selected' : '')} style={{backgroundImage: 'url('+item.image+')'}}>
				<span>{item.shortLabel}</span>
			</a>
		}.bind(this));
		return (
			<div className={'fade-in-component thumb-list'+(this.state.initialized ? ' initialized' : '')}>
				{items}
			</div>
		)
	}
}