import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import L from 'leaflet';

import config from './../config';

import imageSizes from './../utils/imageSizes';

export default class ImageMap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialized: false
		};
	}

	componentDidMount() {
		console.log(this.props);
		this.map = L.map(this.refs.mapView, {
			minZoom: 0,
			maxZoom: 3,
			zoom: 0,
			crs: L.CRS.Simple,
			zoomControl: false
		});

		window.map = this.map;

		if (this.props.imageObj) {
			this.loadImage(this.props.imageObj);
		}
	}

	componentWillReceiveProps(props) {
		if (props.imageObj) {
			this.loadImage(props.imageObj);
		}
	}

	loadImage(imageObj) {
		if (this.lowResOverlay) {
			this.map.removeLayer(this.lowResOverlay);
		}
		if (this.highResOverlay) {
			this.map.removeLayer(this.highResOverlay);
		}

		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		var imageWidth = imageObj ? imageObj.imagesize.width : 4936;
		var imageHeight = imageObj ? imageObj.imagesize.height : 5048;
		var url = imageObj ? imageObj.image : 'nationalmuseum-B2710-fram-före kons';

		var factor = windowWidth/imageWidth;
		var bounds = [[0, 0], [imageHeight*factor, imageWidth*factor]];

		this.lowResOverlay = L.imageOverlay(config.imageUrl+imageSizes.getImageUrl()+'x/'+url+'.jpg', bounds);
		this.lowResOverlay.addTo(this.map);

		this.highResOverlay = L.imageOverlay(config.imageUrl+url+'.jpg', bounds);
		this.highResOverlay.addTo(this.map);

		this.map.setMaxBounds(bounds);

		this.map.panTo([imageHeight, 0]);

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 100);
	}

	zoomButtonClickHandler(zoomValue) {
		this.map.setZoom(this.map.getZoom()+zoomValue);
	}

	render() {
		return <div className={'image-map-container'+(this.state.initialized ? ' initialized' : '')}>
			<div className="map-container" ref="mapView" />

			<div className="zoom-control">
				<a className="image-button icon-plus" onClick={this.zoomButtonClickHandler.bind(this, 1)}></a>
				<a className="image-button icon-minus" onClick={this.zoomButtonClickHandler.bind(this, -1)}></a>
			</div>
		</div>
	}
}