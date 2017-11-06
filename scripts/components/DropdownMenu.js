import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

export default class DropdownMenu extends React.Component {
	constructor(props) {
		super(props);

		this.menuButtonClick = this.menuButtonClick.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
		this.windowClickHandler = this.windowClickHandler.bind(this);
		this.closeButtonClickHandler = this.closeButtonClickHandler.bind(this);

		this.state = {
			menuOpen: false
		};
	}

	menuButtonClick() {
		this.setState({
			menuOpen: !this.state.menuOpen
		}, function() {
			if (this.state.menuOpen && this.props.onOpen) {
				this.props.onOpen();
			}
			if (this.props.disableScrollOnOpen) {
				if (this.state.menuOpen) {
					document.body.classList.add('disable-scroll');
				}
				else {
					document.body.classList.remove('disable-scroll');
				}
			}
		}.bind(this));
	}

	closeButtonClickHandler() {
		this.closeMenu();
	}

	closeMenu() {
		if (this.state.menuOpen) {
			this.setState({
				menuOpen: false
			});
			document.body.classList.remove('disable-scroll');
		}
	}

	windowClickHandler(event) {
		var componentEl = ReactDOM.findDOMNode(this.refs.container);

		if (!componentEl) {
			return;
		}

		if (!componentEl.contains(event.target)) {
			this.closeMenu();
		}
	}

	componentDidMount() {
		if (!this.props.manuallyClose) {
			document.getElementById('app').addEventListener('click', this.windowClickHandler);
		}
	}

	componeneWillUnmount() {
		if (!this.props.manuallyClose) {
			document.getElementById('app').removeEventListener('click', this.windowClickHandler);
		}
		document.body.classList.remove('disable-scroll');
	}

	componentWillReceiveProps(props) {
	}

	render() {
		return (
			<div ref="container" className={'dropdown-wrapper'+(this.props.dropdownDirection ? ' dropdown-direction-'+this.props.dropdownDirection : '')}>

				<a className={'dropdown-link'+(this.props.className ? ' '+this.props.className : '')} onClick={this.menuButtonClick}>{this.props.label || ''}</a>

				<div className={'dropdown-container dropdown-list'+(this.state.menuOpen || this.props.keepOpen ? ' open' : '')+(this.props.headerText ? ' has-header' : '')}>
					{
						this.props.showCloseButton &&
						<span className="close-button" onClick={this.closeButtonClickHandler} dangerouslySetInnerHTML={{__html: '&#xd7'}} />
					}
					{
						this.props.headerText &&
						<div className="panel-heading dropdown-heading">
							<span className="heading-label">{this.props.headerText}</span>
						</div>
					}
					<div className="list-container minimal-scrollbar">
						{this.props.children}
					</div>
				</div>

			</div>
		);
	}
}