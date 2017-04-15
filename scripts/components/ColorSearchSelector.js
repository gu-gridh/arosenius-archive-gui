import React from 'react';

export default class ColorSearchSelector
 extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			initialized: false
		}
	}

	componentDidMount() {
		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 100);
	}

	render() {
		return <div className={'fade-in-component'+(this.state.initialized ? ' initialized' : '')} style={{height: 300, backgroundColor: '#333'}}>ColorSearchSelector</div>;
	}
}