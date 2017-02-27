import React from 'react';

export default class ThumbnailCircles
 extends React.Component {
	constructor(props) {
		super(props);

		window.thumbs = this;

		this.state = {
			selectedItem: -1
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
				label: 'Eva Arosenius'
			},
			{
				image: 'img/persons/kruse.jpg',
				label: 'Kruse'
			},
			{
				image: 'img/persons/henning.jpg',
				label: 'Henning'
			}
		];
	}

	thumbnailClick(index) {
		this.setState({
			selectedItem: index
		}, function() {
			if (this.props.selectionChanged) {
				this.props.selectionChanged(index);
			}
		}.bind(this));
	}

	render() {
		var items = this.thumbnails.map(function(item, index) {
			return <a onClick={function(e) {e.preventDefault(); this.thumbnailClick(index)}.bind(this)} key={index} href="#" className={"thumb-item"+(this.state.selectedItem != null && this.state.selectedItem == index ? ' selected' : '')} style={{backgroundImage: 'url('+item.image+')'}}>
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