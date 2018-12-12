import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import * as d3 from 'd3';
import * as cloud from 'd3-v4-cloud';

//import * as cloud from './../utils/d3.TagCloud'

import config from './../config';

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

		this.fontSize = d3.scaleLinear().domain([this.docCountMin, this.docCountMax]);

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
				return (this.fontSize(d.doc_count)*60)+20;
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
			.style('fill', '#fff')
			.attr('text-anchor', 'middle')
			.attr('transform', function(d) {
				return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
			})
			.text(function(d) {
				return d.value;
			})
			.on('click', function(d) {
				console.log(d);
			}.bind(this));
	}

	windowResizeHandler() {
		if (this.state.data) {
			this.layout.stop().words(this.state.data).start()
		}
	}

	render() {
		return <div ref="container" className={'tag-cloud'+(this.state.loading ? ' loading' : '')}>

			<div className="loading-overlay" />

			<div id="cloudContainer" />

		</div>;
	}
}
