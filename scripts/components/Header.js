import React from 'react';

export default class Header extends React.Component {
	constructor(props) {
		super(props);

		this.openTagSearchButtonClickHandler = this.openTagSearchButtonClickHandler.bind(this);

		this.state = {
			smallHeader: false,
			initialized: false
		};
	}

	openTagSearchButtonClickHandler(event) {
		event.preventDefault();

		window.eventBus.dispatch('search.open-tags');
	}

	componentDidMount() {
		window.addEventListener('scroll', function(e){
			var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

			if (scrollTop > 300) {
				this.setState({
					smallHeader: true
				});
			} else {
				this.setState({
					smallHeader: false
				});
			}
		}.bind(this));

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 200);
	}

	render() {
		return (
			<header className={"site-header"+(this.props.routerPath.indexOf('/image/') > -1 || this.state.smallHeader || this.props.smallHeader ? ' small ' : '')+(this.state.initialized ? ' initialized' : '')}>
				<div className="site-logo"><a href="#/">IA</a></div>

				<div className="header-content">
					<h1 className="site-title"><a href="#/">Aroseniusarkivet</a></h1>

					<nav className="site-nav">
						<ul>
							<li><a onClick={function(event) {
								event.preventDefault();

								window.eventBus.dispatch('about-panel.open');
							}} href="https://aroseniusarkivet.dh.gu.se/projekt/">Om projektet och Ivar Arosenius</a></li>
							<li><a href="https://aroseniusarkivet.dh.gu.se/projekt/bidra-till-arkivet/">Bidra till arkivet</a></li>
							<li><a onClick={this.openTagSearchButtonClickHandler} href="#">Upptäck arkivet</a></li>
						</ul>
					</nav>
				</div>
			</header>
		)
	}
}
