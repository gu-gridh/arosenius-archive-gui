import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import config from './../config';

const d3 = require('d3');
const cloud =require('d3-v4-cloud');

//import * as cloud from './../utils/d3.TagCloud'

export default class TagCloud extends React.Component {
	constructor(props) {
		super(props);

		this.drawCloud = this.drawCloud.bind(this);
		this.windowResizeHandler = this.windowResizeHandler.bind(this);

		this.state = {
			loading: false,
			initialized: false
		};
	}

	componentDidMount() {
		var w = window.innerWidth;
        var h = window.innerHeight;

		this.svg = d3.select('#cloudContainer').append('svg');

		this.vis = this.svg.append('g');

		window.addEventListener('resize', this.windowResizeHandler);

		this.fetchData();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.windowResizeHandler);
	}

	componentWillReceiveProps(props) {
	}

	fetchData() {
		fetch(config.apiUrl+config.endpoints.tag_cloud)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				this.setState({
					data: data
				}, function() {
					this.makeClound();
				}.bind(this));

			}.bind(this));
	}

	makeClound() {
		this.docCountMin = _.min(this.state.data, function(item) {
			return item.doc_count;
		}).doc_count;

		this.docCountMax = _.max(this.state.data, function(item) {
			return item.doc_count;
		}).doc_count;

		this.fontSize = d3.scaleLinear().domain([this.docCountMin, this.docCountMax]).range([14, 100]);

		this.layout = cloud.cloud()
			.size([window.innerWidth, window.innerHeight])
			.words(this.state.data)
			.padding(5)
			.font('Arial')
			//.rotate(0)
			.rotate(function() {
				//return 0;
				return ~~(Math.random() * 2) * 90;
			})
			.text(function(d) {
				return d.value;
			})
			.fontSize(function(d) {
				return this.fontSize(d.doc_count);
			}.bind(this))
			.on('end', this.drawCloud);

		this.layout.start();
	}

	drawCloud(words) {
		var w = window.innerWidth;
        var h = window.innerHeight;

    	this.svg.attr('width', w).attr('height', h);

		this.vis.attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')')
			.selectAll('a')
			.data(words)
			.enter().append('a')
			.attr('xlink:href', function(d) {
				return '#/search/tags/'+d.type+'/'+d.value;
			})
			.append('text')
			.style('font-size', function(d) {
				return d.size+'px'
			}.bind(this))
			.style('font-family', 'Arial')
			.style('fill', function(d) {
				if (d.type == 'genre') {
					return '#aeeaa0';
				}
				if (d.type == 'tags') {
					return '#f48fb1';
				}
				if (d.type == 'place') {
					return '#4fc3f7';
				}
				if (d.type == 'person') {
					return '#ffd54f';
				}
				return '#fff';
			})
			.attr('text-anchor', 'middle')
			.attr('transform', function(d) {
				return 'translate(' + [d.x, d.y] + ') rotate(' + d.rotate + ')';
			})
			.text(function(d) {
				return d.value;
			})
			.on('click', function(d) {
			}.bind(this))
			.on('mouseover', function(d) {
			});
	}

	windowResizeHandler() {
		if (this.state.data) {
			//this.makeClound();

			//this.drawCloud();
			
			this.layout.stop().words(this.state.data).start();
		}
	}

	render() {
		return <div ref="container" className={'tag-cloud'+(this.state.loading ? ' loading' : '')}>

			<div className="loading-overlay" />

			<div id="cloudContainer" />

		</div>;
	}
}
