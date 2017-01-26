import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

export default class Image extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			image: null
		};
	}

	fetchImage() {
		fetch('http://cdh-vir-1.it.gu.se:8004/document/'+this.props.params.imageId)
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				this.setState({
					image: json.data
				});
			}.bind(this)).catch(function(ex) {
				console.log('parsing failed', ex)
			})
		;
	}

	componentDidMount() {
		console.log('Image: componentDidMount');
		this.fetchImage();
	}

	componentDidUpdate(prevProps) {
		console.log('Image: componentDidUpdate');
		if (this.state.image.id != this.props.params.imageId) {
			this.fetchImage();
		}
	}

	render() {
		console.log('Image: render');
		if (this.state.image) {		
			return <div>
				<h1>{this.state.image.title}</h1>
				<p>{this.state.image.description}</p>
				<p><img src={'http://cdh-vir-1.it.gu.se:8004/images/600x/'+this.state.image.image+'.jpg'} /></p>
			</div>;
		}
		else {
			return <div></div>;
		}
	}
}