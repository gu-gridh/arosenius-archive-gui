import React from 'react';

export default class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			randomNumber: Math.round(Math.random()*1000)
		};

		this.makeRandomClick = this.makeRandomClick.bind(this);
	}

	makeRandomClick() {
		this.setState({
			randomNumber: Math.round(Math.random()*1000)
		});

		if (this.props.onRandomClick) {
			this.props.onRandomClick({
				name: this.props.name,
				randomNumber: this.state.randomNumber
			});
		}

		this.render();
	}

	render() {
		return <div>
			<h1>Hæ {this.props.name}</h1>
			<h3>This is a random number: {this.state.randomNumber}</h3>
			<a onClick={this.makeRandomClick}>Change the random number</a>
		</div>;
	}
}