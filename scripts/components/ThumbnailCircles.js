import React from 'react';

export default class ThumbnailCircles
 extends React.Component {
	constructor(props) {
		super(props);

		window.thumbs = this;

		this.state = {
			selectedPerson: null
		};

		this.thumbnailClick = this.thumbnailClick.bind(this);

		this.thumbnails = [
			{
				image: 'img/persons/ivar.jpg',
				label: 'Ivar Arosenius'
			},
			{
				image: 'img/persons/lillan.jpg',
				label: 'Eva Arosenius'
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
			}
		];
	}

	thumbnailClick(index) {
		this.setState({
			selectedPerson: this.state.selectedPerson == this.thumbnails[index].label ? '' : this.thumbnails[index].label
		}, function() {
			if (this.props.selectionChanged) {
				this.props.selectionChanged({
					selectedPerson: this.state.selectedPerson
				});
			}
		}.bind(this));
	}

	componentDidMount() {
		this.setState({
			selectedPerson: this.props.selectedPerson
		})
	}

	componentWillReceiveProps(props) {
		this.setState({
			selectedPerson: props.selectedPerson
		})
	}

	render() {
		var items = this.thumbnails.map(function(item, index) {
			return <a onClick={function(e) {e.preventDefault(); this.thumbnailClick(index)}.bind(this)} key={index} href="#" className={"thumb-item"+(this.state.selectedPerson != null && this.state.selectedPerson == item.label ? ' selected' : '')} style={{backgroundImage: 'url('+item.image+')'}}>
				<span>{item.label}</span>
			</a>
		}.bind(this));
		return (
			<div className="thumb-list">
				{items}
			</div>
		)
	}
}