import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';
import * as d3 from 'd3';
import * as cloud from 'd3-v4-cloud';

import config from './../config';

export default class TagCloud extends React.Component {
	constructor(props) {
		super(props);

		this.drawCloud = this.drawCloud.bind(this);

		this.state = {
			loading: false,
			initialized: false
		};
	}

	componentDidMount() {
		window.d3 = d3;
		console.log(cloud);

		this.fetchData();
	}

	componentWillUnmount() {
	}

	componentWillReceiveProps(props) {
	}

	fetchData() {
		fetch(config.apiUrl+config.endpoints.googlevisionlabels)
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
		var docCountMin = _.min(this.state.data, function(item) {
			return item.doc_count;
		}).doc_count;

		var docCountMax = _.max(this.state.data, function(item) {
			return item.doc_count;
		}).doc_count;

		var fontSize = d3.scaleLinear().domain([docCountMin, docCountMax]);

		this.layout = cloud.cloud()
			.size([window.innerWidth, window.innerHeight])
			.words(this.state.data)
			.padding(5)
			.font('Arial')
			//.rotate(0)
			.rotate(function() {
				return ~~(Math.random() * 2) * 90;
			})
			.fontSize(function(d) {
				return (fontSize(d.doc_count)*60)+20;
			})
			.on('end', this.drawCloud);

		this.layout.start();
	}

	drawCloud(words) {

		d3.select('#cloudContainer').append('svg')
			.attr('width', this.layout.size()[0])
			.attr('height', this.layout.size()[1])
			.append('g')
			.attr('transform', 'translate(' + this.layout.size()[0] / 2 + ',' + this.layout.size()[1] / 2 + ')')
			.selectAll('text')
			.data(words)
			.enter().append('text')
			.style('font-size', function(d) {
				return (d.size)+'px'
			})
			.style('font-family', 'Arial')
			.style('fill', '#fff')
			.attr('text-anchor', 'middle')
			.attr('transform', function(d) {
				return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
			})
			.text(function(d) {
				return d.value;
			});
	}

	render() {
		return <div ref="container" className={'tag-cloud'+(this.state.loading ? ' loading' : '')}>

			<div className="loading-overlay" />

			<div id="cloudContainer" />

		</div>;
	}
}
