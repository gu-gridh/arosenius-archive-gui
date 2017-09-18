import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import L from 'leaflet';

import config from './../config';

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

//		var maxZoom = Math.ceil( Math.log( (windowWidth/imageWidth > windowHeight/imageHeight ? imageWidth/windowWidth : imageHeight/windowHeight) ) / Math.log(2) );

		this.map = L.map(this.refs.mapView, {
			minZoom: 0,
			maxZoom: 2,
//			center: [0, 0],
			zoom: 0,
			crs: L.CRS.Simple
		});

		window.map = this.map;

		// calculate the edges of the image, in coordinate space
		var northEast = this.map.unproject([0, imageWidth], this.map.getMaxZoom()-1);
		var southWest = this.map.unproject([imageHeight, 0], this.map.getMaxZoom()-1);

		var bounds = new L.LatLngBounds(southWest, northEast);

		var factor = windowWidth/imageWidth;
		console.log(factor);
		var bounds = [[0, 0], [imageHeight*factor, imageWidth*factor]];
//		var bounds = [[0, imageWidth], [imageHeight, 0]];

		var lowResOverlay = L.imageOverlay(config.imageUrl+'1000x/'+url+'.jpg', bounds);
		lowResOverlay.addTo(this.map);

		var highResOverlay = L.imageOverlay(config.imageUrl+url+'.jpg', bounds);
		highResOverlay.addTo(this.map);

		this.map.setMaxBounds(bounds);

		console.log('imageWidth: '+imageWidth);
		console.log('imageHeight: '+imageHeight);

		this.map.panTo([imageHeight, 0]);

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 300);
	}


	componentWillReceiveProps(props) {
	}

	render() {
		return <div className={'image-map-container'+(this.state.initialized ? ' initialized' : '')}>
			<div className="map-container" ref="mapView" />
		</div>
	}
}