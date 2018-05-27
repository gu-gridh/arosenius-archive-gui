import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import * as THREE from 'three';

window.THREE = THREE;

import './../lib/texture-loader';
import './../lib/trackball-controls';


import ImageListCollection from '../collections/ImageListCollection';

export default class TsneView extends React.Component {
	constructor(props) {
		super(props);

		window.tsneView = this;

		this.windowResizeHandler = this.windowResizeHandler.bind(this);
		this.windowMouseMoveHandler = this.windowMouseMoveHandler.bind(this);

		this.state = {
			images: [],
			loadNumber: 0,
			initialized: false,
			waitingForLoad: false,
			tsneData: []
		};

		this.collection = new ImageListCollection(function(event) {
			// Update visualization to match ID's of fetched data to 3D objects
			setTimeout(function() {
				this.waitingForLoad = false;
			}.bind(this), 500);
		}.bind(this), function(event) {
			this.setState({
				loading: false
			});
		}.bind(this));
	}

	componentDidMount() {
		document.body.classList.add('tsne-view-app');

		// Build the canvas
		// Start Scene and Three.js environment (camera, lights, mouse control)
		// Listen for DOM events for Three.js

		this.scene = new THREE.Scene();

		/**
		* Camera
		**/

		// Specify the portion of the scene visiable at any time (in degrees)
		var fieldOfView = 75;

		// Specify the camera's aspect ratio
		var aspectRatio = window.innerWidth / window.innerHeight;

		/*
		Specify the near and far clipping planes. Only objects
		between those planes will be rendered in the scene
		(these values help control the number of items rendered
		at any given time)
		*/
		var nearPlane = 100;
		var farPlane = 50000;

		// Use the values specified above to create a camera
		this.camera = new THREE.PerspectiveCamera(
			fieldOfView, aspectRatio, nearPlane, farPlane
		);

		// Finally, set the camera's position
		this.camera.position.z = 20500;
		this.camera.position.y = -100;

		/**
		* Renderer
		**/

		// Create the canvas with a renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});

		// Add support for retina displays
		this.renderer.setPixelRatio(window.devicePixelRatio);

		// Specify the size of the canvas
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		// Add the canvas to the DOM
		// document.body.appendChild(renderer.domElement);

		this.refs.canvasContainer.appendChild(this.renderer.domElement);

		/**
		* Lights
		**/

		// Add a point light with #fff color, .7 intensity, and 0 distance
		this.light = new THREE.PointLight( 0xffffff, 1, 0 );

		// Specify the light's position
		this.light.position.set(1, 1, 100);

		// Add the light to the scene
		this.scene.add(this.light);

		/**
		* Set up Raycaster
		**/

		this.raycaster = new THREE.Raycaster();

		this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
		this.mouse = new THREE.Vector2();
		this.intersectObj = {};

		window.addEventListener('resize', this.windowResizeHandler);
		window.document.addEventListener('mousemove', this.windowMouseMoveHandler);

		this.animate();

		this.fetchTsneData();

		// Build visualization
		this.handleProps(this.props);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));

		this.raycaster.setFromCamera(this.mouse, this.camera);
		var intersects = this.raycaster.intersectObjects(this.scene.children);
		if (intersects.length > 0) {
			if (this.intersectObj != intersects[0].object) {
				this.intersectObj = intersects[0].object;
				console.log(this.intersectObj);
			}
		} else {
			this.intersectObj = null;
		}

		this.renderer.render(this.scene, this.camera);
		this.controls.update();
	}

	windowResizeHandler() {
		console.log('windowResizeHandler');
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.controls.handleResize();
	}

	windowMouseMoveHandler(event) {
		this.mouse.x = (event.clientX/window.innerWidth) * 2 - 1;
		this.mouse.y = - (event.clientY/window.innerHeight) * 2 + 1;
	}

	componentWillUnmount() {
		document.body.classList.remove('tsne-view-app');

		window.removeEventListener('resize', this.windowResizeHandler);
		window.document.removeEventListener('mousemove', this.windowMouseMoveHandler);
	}

	fetchTsneData() {
		fetch('tsne_data/image_tsne_projections_konstverk.json')
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				this.setState({
					tsneData: data
				}, function() {
					this.buildGeometry();
				}.bind(this));

			}.bind(this));
	}

	/**
	* Build Image Geometry
	**/

	// Iterate over the 20 textures, and for each, add a new mesh to the scene
	buildGeometry() {
		this.sceneObjects = {};

		this.setState({
			loadNumber: 0
		});
		_.each(this.state.tsneData, function(image, index) {
			var geometry = new THREE.PlaneGeometry(image.width*0.8, image.height*0.8);
			image.x *= 1200;
			image.y *= 600;
			image.z = (-200 + index);
			
			var texture = new THREE.TextureLoader().load('tsne_data/'+image.image, function () {
				this.setState({
					loadNumber: this.state.loadNumber+1
				}, function() {
					if (this.state.loadNumber == this.state.tsneData.length) {
						this.setState({
							initialized: true
						});
					}
				}.bind(this));
			}.bind(this));
			
			this.buildMesh(geometry, new THREE.MeshBasicMaterial({
				map: texture,
				transparent: true
			}), image);
		}.bind(this));
	}

	buildMesh(geometry, material, image) {
		// Convert the geometry to a BuferGeometry for additional performance
		var geometry = new THREE.BufferGeometry().fromGeometry(geometry);

		// Combine the image geometry and material into a mesh
		var mesh = new THREE.Mesh(geometry, material);

		// Set the position of the image mesh in the x,y,z dimensions
		mesh.position.set(image.x, image.y, image.z);

		mesh.userData.id = image.image.replace('thumbs/', '').replace('.jpg', '');
		this.sceneObjects[mesh.userData.id] = mesh;

		// Add the image to the scene
		this.scene.add(mesh);
	}

	componentWillReceiveProps(props) {
		// Reset visialization?
		this.handleProps(props);
	}

	fetchData(params, count, page, append, archiveMaterial) {
		this.collection.fetch(params, count, page, append, archiveMaterial)
	}

	handleProps(props) {
		if (!props.year && !props.searchString && !props.searchPerson && !props.searchPlace && !props.searchMuseum && !props.searchGenre && !props.searchTags && !props.searchType && !props.searchHue && !props.searchSaturation && this.state.images.length == 0) {
			this.waitingForLoad = true;

			var params;

			var state = {
				loading: true
			};

			if (props.listType == 'simple') {
				params = {
					sort: 'insert_id'
				};

				state.images = [];
			}

			this.setState(state);

			this.fetchData(params, props.count, 1, false, props.archiveMaterial || null);
		}
		else if (this.props.searchString != props.searchString ||
			this.props.searchPerson != props.searchPerson ||
			this.props.searchPlace != props.searchPlace ||
			this.props.searchMuseum != props.searchMuseum ||
			this.props.searchGenre != props.searchGenre ||
			this.props.searchTags != props.searchTags ||
			this.props.searchType != props.searchType ||
			this.props.searchHue != props.searchHue ||
			this.props.year != props.year ||
			this.props.google_label != props.google_label ||

			this.props.searchSaturation != props.searchSaturation ||

			this.state.images.length == 0
		) {
			this.waitingForLoad = true;

			var params = {
				searchString: props.searchString,
				person: props.searchPerson,
				place: props.searchPlace,
				museum: props.searchMuseum,
				genre: props.searchGenre,
				tags: props.searchTags,
				type: props.searchType,
				hue: props.searchHue,
				saturation: props.searchSaturation,
				year: props.year,
				google_label: props.google_label
			};

			var state = {
				loading: true
			};

			if (this.props.listType != props.listType) {
				if (props.listType == 'simple') {
					params = {
						sort: 'insert_id'
					};
				}

				state.images = [];
			}

			this.setState(state);

			this.fetchData(params, props.count, 1, false, props.archiveMaterial || null);
		}
		else if (this.props.listType != props.listType) {
			var params = {};

			if (props.listType == 'simple') {
				params.sort = 'insert_id';
			}
			this.fetchData(params, props.count, 1, false, props.archiveMaterial || null);
		}
	}

	render() {
		return <div className={'tsne-view'+(this.state.initialized ? ' initialized' : '')}>
			<div ref="canvasContainer" className="three-canvas-container"></div>

			<div className="loading"><div className="process-label">{!isNaN((this.state.loadNumber/this.state.tsneData.length)*100) ? Math.round((this.state.loadNumber/this.state.tsneData.length)*100)+'%' : ''}</div></div>
		</div>;
	}
}
