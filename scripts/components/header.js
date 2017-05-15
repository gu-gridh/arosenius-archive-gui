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
			<header className={"site-header"+(this.props.routerPath.indexOf('/image/') > -1 || this.state.smallHeader ? ' small ' : '')+(this.state.initialized ? ' initialized' : '')}>
				<div className="site-logo"><a href="#/">IA</a></div>

				<div className="header-content">
					<h1 className="site-title"><a href="#/">Ivar Aroseniusarkivet</a></h1>

					<nav className="site-nav">
						<ul>
							<li><a href="http://aroseniusarkivet.org/projekt/">Projektet</a></li>
							<li><a href="http://aroseniusarkivet.org/projekt/utoka-arkivet/">Utöka arkivet</a></li>
						</ul>
					</nav>
				</div>
			</header>
		)
	}
}