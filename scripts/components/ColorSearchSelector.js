import React from 'react';
import ReactDOM from 'react-dom';

var d3 = require('d3');
var chroma = require('chroma-js');

export default class ColorSearchSelector
 extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialized: false
		}

		this.graphRadius = 250;

		this.graphMargins = 0;

		this.circularGraph = false;

		this.baseData = this.createBaseData();

		this.state = {
			graphWidth: 1000,
			graphHeight: 200,
			graphMargins: 20
		};
	}

	createBaseData() {
		var baseData = [];

		for (var hue = 0; hue<=360; hue += 5) {
			var hueObj = {
				hue: hue,
				saturation: []
			};

			for (var saturation = 0; saturation<=100; saturation += 5) {
				hueObj.saturation.push(saturation);
			}
			baseData.push(hueObj);
		}

		return baseData;
	}

	renderGraph() {
//		d3.selectAll('svg#graphContainer > *').remove();

		this.xRange = d3.scaleLinear().range([this.graphMargins, this.state.graphWidth-(this.graphMargins*2)]).domain([0, 360]);
		this.yRange = d3.scaleLinear().range([this.graphMargins, this.state.graphHeight-(this.graphMargins*2)]).domain([100, 0]);

//		this.$el.find('svg.graph-container').attr('width', this.graphWidth+this.graphMargins);
//		this.$el.find('svg.graph-container').attr('height', this.graphHeight+this.graphMargins);

		var view = this;

		this.vis = d3.select(this.refs.graphContainer);

		this.graphContainer = this.vis;

		this.graphContainer.selectAll('g.hue')
			.data(this.baseData)
			.enter()
			.append('g')
			.attr('class', 'hue')
			.each(function(data, hue) {
				d3.select(this)
					.selectAll('circle')
					.data(data.saturation)
					.enter()

					.append('rect')
					.attr('x', function(d) {
						if (!view.circularGraph) {
							return view.xRange(view.baseData[hue].hue)
						}
					})
					.attr('y', function(d) {
						return view.yRange(d)
					})
					.attr('width', function(d) {
						return (view.state.graphWidth/view.baseData.length)+1;
					})
					.attr('height', function(d) {
						return (view.state.graphHeight/view.baseData[0].saturation.length)+1;
					})
					.attr('opacity', 1)
					.attr('fill', function(d) {
						return chroma(view.baseData[hue].hue, (d/100), 0.2+(d/100), 'hsv').hex();
					})
/*
					.append('circle')
					.attr('cy', function(d) {
						return view.yRange(d)
					})
					.attr('cx', function(d) {
						if (!view.circularGraph) {
							return view.xRange(view.baseData[hue].hue)
						}
					})
					.attr('r', function(d) {
						return ((view.state.graphWidth/view.baseData.length)/4)*3;
					})
					.attr('opacity', 0.8)
					.attr('fill', function(d) {
						return chroma(view.baseData[hue].hue, (d/100), 0.4+(d/100), 'hsv').hex();
					})
*/
					.on('click', function(event) {
						if (view.props.onColorSelect) {
							view.props.onColorSelect({
								hue: view.baseData[hue].hue,
								saturation: event
							});
						}
					});
			});

	}

	componentDidMount() {
		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 100);

		this.setState({
			graphWidth: ReactDOM.findDOMNode(this).clientWidth,
			graphHeight: ReactDOM.findDOMNode(this).clientHeight
		}, function() {
			this.renderGraph();
		}.bind(this));
	}

	render() {

//		this.$el.find('svg.graph-container').attr('width', this.graphWidth+this.graphMargins);
//		this.$el.find('svg.graph-container').attr('height', this.graphHeight+this.graphMargins);
		return <div className={'fade-in-component'+(this.state.initialized ? ' initialized' : '')} style={{boxSizing: 'border-box', height: 200, backgroundColor: '#333'}}>
			<svg ref="graphContainer" width={this.state.graphWidth+this.state.graphMargins} height={this.state.graphHeight+this.state.graphMargins}></svg>
		</div>;
	}
}