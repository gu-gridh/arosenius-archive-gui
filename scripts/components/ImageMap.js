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
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		var imageWidth = this.props.imageObj ? this.props.imageObj.imagesize.width : 4936;
		var imageHeight = this.props.imageObj ? this.props.imageObj.imagesize.height : 5048;
		var url = this.props.imageObj ? this.props.imageObj.image : 'nationalmuseum-B2710-fram-före kons';

		this.map = L.map(this.refs.mapView, {
			minZoom: 0,
			maxZoom: 3,
			zoom: 0,
			crs: L.CRS.Simple,
			zoomControl: false
		});

		window.map = this.map;

		var factor = windowWidth/imageWidth;
		var bounds = [[0, 0], [imageHeight*factor, imageWidth*factor]];

		var lowResOverlay = L.imageOverlay(config.imageUrl+imageSizes.getImageUrl()+'x/'+url+'.jpg', bounds);
		lowResOverlay.addTo(this.map);

		var highResOverlay = L.imageOverlay(config.imageUrl+url+'.jpg', bounds);
		highResOverlay.addTo(this.map);

		this.map.setMaxBounds(bounds);

		this.map.panTo([imageHeight, 0]);

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 100);
	}

	componentWillReceiveProps(props) {
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