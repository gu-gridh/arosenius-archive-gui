import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import * as THREE from 'three';
import { hashHistory } from 'react-router';

window.THREE = THREE;

import './../lib/texture-loader';
import './../lib/trackball-controls';
import SimpleListItem from './SimpleListItem';

import config from './../config';

import ImageListCollection from '../collections/ImageListCollection';

export default class TsneView extends React.Component {
	constructor(props) {
		super(props);

		window.tsneView = this;

		this.windowResizeHandler = this.windowResizeHandler.bind(this);
		this.windowMouseMoveHandler = this.windowMouseMoveHandler.bind(this);
		this.dataSetMenuClickHandler = this.dataSetMenuClickHandler.bind(this);
		this.menuSelectChangeHandler = this.menuSelectChangeHandler.bind(this);
		this.getHoverObjectStyle = this.getHoverObjectStyle.bind(this);

		this.state = {
			images: [],
			loadNumber: 0,
			initialized: false,
			waitingForLoad: false,
			tsneData: [],
			dataSet: 'all'
		};

		this.dataSets = [
			{
				name: 'Alla',
				id: 'all'
			},
			{
				name: 'Konstverk',
				id: 'konstverk'
			},
			{
				name: 'Fotografi',
				id: 'photographs'
			}
		];

		this.collection = new ImageListCollection(function(event) {
			// Update visualization to match ID's of fetched data to 3D objects
			setTimeout(function() {
				this.waitingForLoad = false;
			}.bind(this), 500);

			console.log(event);

			this.setState({
				images: event.data.documents
			}, function() {
				this.updateSelection();
			}.bind(this))
		}.bind(this), function(event) {
			this.setState({
				loading: false
			});
		}.bind(this));
	}

	updateSelection() {
		if (!this.state.images || this.state.images.length == 0) {
			var viewAll = true;
		}

		for (var object in this.sceneObjects) {
			if (viewAll || _.findWhere(this.state.images, {id: object})) {
				this.sceneObjects[object].material.opacity = 1;
			}
			else {
				this.sceneObjects[object].material.opacity = 0.05;
			}
		}
	}

	loadMuseumsList() {
		fetch(config.apiUrl+config.endpoints.museums)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				this.setState({
					museumsList: data
				});

			}.bind(this));
	}

	loadGenresList() {
		fetch(config.apiUrl+config.endpoints.genres)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				this.setState({
					genresList: data
				});

			}.bind(this));
	}

	menuSelectChangeHandler(event) {
		if (event.target.value == 'all') {
			hashHistory.push('/search');
		}
		else {
			hashHistory.push('/search/tags/'+event.target.dataset.type+'/'+event.target.value);
		}
	}

	componentDidMount() {
		this._isMounted = true;

		document.body.classList.add('tsne-view-app');

		this.loadMuseumsList();
		this.loadGenresList();

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

		this.fetchTsneData(this.state.dataSet);

		// Build visualization
		this.handleProps(this.props);
	}

	animate() {
		if (!this._isMounted) {
			return;
		}

		requestAnimationFrame(this.animate.bind(this));

		this.raycaster.setFromCamera(this.mouse, this.camera);

		if (this.state.initialized) {
			var intersects = this.raycaster.intersectObjects(this.scene.children);
			if (intersects.length > 0) {
				if (this.intersectObj != intersects[0].object) {
					this.intersectObj = intersects[0].object;

					if (!this.hoverStateInterval) {
						this.lastIntersectObj = this.intersectObj;
	
						this.hoverStateInterval = setInterval(function() {
							if (this.lastIntersectObj == this.intersectObj) {
								this.setState({
									hoverId: this.intersectObj.userData.id
								});
							}
							this.hoverStateInterval = undefined;
						}.bind(this), 1000);
					}
				}
			} else {
				this.intersectObj = null;

				this.setState({
					hoverId: undefined
				});
			}
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

		this.setState({
			mouseX: event.clientX,
			mouseY: event.clientY
		});
	}

	dataSetMenuClickHandler(event) {
		if (event.target.dataset.dataset != this.state.dataSet) {
			this.setState({
				dataSet: event.target.dataset.dataset
			});

			this.fetchTsneData(event.target.dataset.dataset);
		}
	}

	componentWillUnmount() {
		document.body.classList.remove('tsne-view-app');

		window.removeEventListener('resize', this.windowResizeHandler);
		window.document.removeEventListener('mousemove', this.windowMouseMoveHandler);

		this._isMounted = false;

		if (this.sceneObjects) {
			this.removeSceneObjects();
			this.sceneObjects = {};
		}

		if (this.scene) {
			this.scene = null;
		}

		if (this.renderer) {
			this.renderer.renderLists.dispose();
			this.renderer = null;
		}

		if (this.camera) {
			this.camera = null;
		}

		if (this.controls) {
			this.controls = null;
		}

		if (this.light) {
			this.light = null;
		}

		if (this.raycaster) {
			this.raycaster = null;
		}

		this.state = {};
	}

	fetchTsneData(dataSet) {
		hashHistory.push('/search');

		this.setState({
			images: [],
			loadNumber: 0,
			initialized: false,
			waitingForLoad: false,
			tsneData: []
		});

		fetch('tsne_data/image_tsne_projections_'+dataSet+'.json')
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

	removeSceneObjects() {
		for (let i = this.scene.children.length - 1; i >= 0; i--) {
			if (this.scene.children[i].geometry) {
				this.scene.children[i].geometry.dispose();
				this.scene.children[i].material.dispose();
				this.scene.remove(this.scene.children[i]);
				this.scene.children[i] = null;
			}
		}
	}

	/**
	* Build Image Geometry
	**/

	buildGeometry() {
		// First, remove all objects if existing
		if (this.sceneObjects) {
			this.removeSceneObjects();
		}

		this.sceneObjects = {};

		this.setState({
			loadNumber: 0
		});

		_.each(this.state.tsneData, function(image, index) {
			var geometry = new THREE.PlaneGeometry(image.width*0.8, image.height*0.8);
			image.x *= 1200;
			image.y *= 600;
			image.z = (-200 + index);
			
			var texture = new THREE.TextureLoader().load(config.imageUrl+'255x/'+image.image+'.jpg', function () {
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

		//mesh.userData.id = image.image.replace('thumbs/', '').replace('.jpg', '');
		mesh.userData.id = image.id;
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
		if ((this.props.searchMuseum != '' && this.props.searchMuseum != props.searchMuseum) ||
			(this.props.searchGenre != '' && this.props.searchGenre != props.searchGenre)) {
			this.waitingForLoad = true;

			var params = {
				simple: true,
				museum: props.searchMuseum,
				genre: props.searchGenre,
				type: this.state.dataSet == 'photographs' ? 'Fotografi' : this.state.dataSet == 'konstverk' ? 'Konstverk' : undefined
			};

			var state = {
				loading: true,
				images: []
			};

			if (props.searchMuseum == 'all' || props.searchGenre == 'all') {
				this.setState({
					images: [],
					loading: false
				}, function() {
					this.updateSelection();
				}.bind(this));
			}
			else {
				this.setState(state);

				this.fetchData(params, 1000, 1, false, props.archiveMaterial || null);
			}
		}
	}

	getHoverObjectStyle() {
		var styleObj = {
			top: this.state.mouseY-30, 
			left: this.state.mouseX-30
		};

		if (this.refs && this.refs.hoverObject && this.refs.hoverObject.refs.el) {
			if (this.refs.hoverObject.refs.el.clientWidth + styleObj.left > document.body.clientWidth) {
				styleObj.left = undefined;
				styleObj.right = 5;
			}

			if (this.refs.hoverObject.refs.el.clientHeight + styleObj.top > document.body.scrollHeight) {
				styleObj.top = undefined;
				styleObj.bottom = 95;
			}
		}

		return styleObj;
	}

	render() {
		return <div className={'tsne-view'+(this.state.initialized ? ' initialized' : '')}>
			<div className="tsne-menu">
				<div className="menu-group">
					{
						this.dataSets.map(function(dataSet) {
							return <a className={this.state.dataSet == dataSet.id ? 'selected' : ''} onClick={this.dataSetMenuClickHandler} key={dataSet.id} data-dataset={dataSet.id}>{dataSet.name}</a>;
						}.bind(this))
					}

					<div className="spacer"/>

					<select className="menu-select" data-type="museum" onChange={this.menuSelectChangeHandler}>
						<option value="all">Samling</option>
						{
							this.state.museumsList ? this.state.museumsList.map(function(museum, index) {
								return <option key={museum.value} value={museum.value}>{museum.value}</option>;
							}.bind(this)) : []
						}
					</select>

					{
					/*
					<select className="menu-select" data-type="genre" onChange={this.menuSelectChangeHandler}>
						<option value="all">Underkategorier</option>
						{
							this.state.genresList ? this.state.genresList.map(function(genre, index) {
								return <option key={genre.value} value={genre.value}>{genre.value}</option>;
							}.bind(this)) : []
						}
					</select>
					*/
					}

				</div>
			</div>

			<div ref="canvasContainer" className="three-canvas-container"></div>

			<div className="loading"><div className="process-label">{!isNaN((this.state.loadNumber/this.state.tsneData.length)*100) ? Math.round((this.state.loadNumber/this.state.tsneData.length)*100)+'%' : ''}</div></div>

			{
				this.state.hoverId &&
				<div className={'hover-object'} style={this.getHoverObjectStyle()}>
					<SimpleListItem ref="hoverObject" imageId={this.state.hoverId}/>
				</div>
			}
		</div>;
	}
}
