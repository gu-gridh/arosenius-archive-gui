import React from 'react';

export default class Header extends React.Component {
	constructor(props) {
		super(props);

		window.header = this;

		this.state = {
			smallHeader: false,
			initialized: false
		};
	}

	componentDidMount() {
		if (this.props.routerPath == '/') {		
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
		}

		setTimeout(function() {
			this.setState({
				initialized: true
			});
		}.bind(this), 200);
	}

	render() {
		return (
			<header className={"site-header"+(this.state.smallHeader || this.props.routerPath != '/' ? ' small' : '')+(this.state.initialized ? ' initialized' : '')}>
				<div className="site-logo"><a href="#/">IA</a></div>

				<div className="header-content">
					<h1 className="site-title"><a href="#/">Ivar Aroseniusarkivet</a></h1>

					<nav className="site-nav">
						<ul>
							<li><a href="#">Projektet</a></li>
							<li><a href="#">Utöka arkivet</a></li>
						</ul>
					</nav>
				</div>
			</header>
		)
	}
}