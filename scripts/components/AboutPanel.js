import React from 'react';

import WindowScroll from './../utils/window-scroll';

export default class AboutPanel extends React.Component {
	constructor(props) {
		super(props);

		this.panelOpenHandler = this.panelOpenHandler.bind(this);
		this.panelCloseHandler = this.panelCloseHandler.bind(this);
		this.discoverClickHandler = this.discoverClickHandler.bind(this);

		this.state = {
			open: true
		};
	}

	componentDidMount() {
		window.eventBus.addEventListener('about-panel.open', this.panelOpenHandler);
		window.eventBus.addEventListener('about-panel.close', this.panelCloseHandler);
		/*
		window.addEventListener('scroll', function(e) {
			if (this.disableScrollWatch) {
				return;
			}

			var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

			if (scrollTop > window.innerHeight-100) {
				this.setState({
					open: false
				});
			}
		}.bind(this));
		*/
	}

	componentWillUnmount() {
		window.eventBus.removeEventListener('about-panel.open', this.panelOpenHandler);
		window.eventBus.removeEventListener('about-panel.close', this.panelCloseHandler);
	}

	discoverClickHandler(event) {
		event.preventDefault();

		this.panelCloseHandler();

		setTimeout(function() {
			window.eventBus.dispatch('search.open');
		}, 1600);
	}

	panelOpenHandler() {
		this.setState({
			open: true
		});

		new WindowScroll().scrollToY(0, 0.5, 'easeInOutSine', true);
	}

	panelCloseHandler() {
		this.setState({
			open: false
		});
	}

	render() {
		return (
			<div className={'about-panel'+(this.state.open ? ' open' : '')}>
				<div className="content">
					<div className="ivar-badge" />
					<h2>Aroseniusarkivet</h2>

					<p className="description">Den svenska konstn&auml;ren Ivar Arosenius alltf&ouml;r tidiga d&ouml;d &aring;r 1909 skapade en s&auml;rpr&auml;glad aura som utvecklats i en l&aring;ng rad utst&auml;llningar, kataloger och b&ouml;cker. Varje utst&auml;llning och studie har varierat bilden av konstn&auml;rens liv och verk, till &ouml;verv&auml;gande delen utifr&aring;n material som &aring;terfinns i G&ouml;teborgs universitetsbiblioteks,  G&ouml;teborgs konstmuseums och Nationalmuseums samlingar.</p>
					<div className="clearfix" />
					<p className="description medium">Aroseniusarkivet samlar det digitaliserade materialet till en lättillgänglig helhet i syfte att tillgängliggöra Ivar Arosenius konstnärskap för forskare och allmänhet.</p>
					<div className="clearfix" />
					<p className="description small">Arkivet är under uppbyggnad och utökas med fler funktioner och verk.</p>
					<div className="clearfix" />

					<a className="search-link" href="#" onClick={this.discoverClickHandler}>
						<div className="icon" />
						<div className="text">Utforska arkivet</div>
					</a>

					<div className="about-menu" style={{marginBottom: 60}}>
						<a href="http://aroseniusarkivet.org/projekt/">Läs om projektet</a>
						<a href="http://aroseniusarkivet.org/projekt/bidra-till-arkivet/">Bidra till arkivet</a>
					</div>

					<hr />

					<h3>Appar</h3>

					<div className="apps">

						<a href="https://itunes.apple.com/se/app/dockhemmet/id1325606493?mt=8/">
							<img src="img/apps/dockhemmet.png" />
							<span className="text">Dockhemmet</span>
						</a>

						<a href="https://itunes.apple.com/se/app/id1332811436?mt=8/">
							<img src="img/apps/lillansresor.png" />
							<span className="text">Lillans resor</span>
						</a>

					</div>

					<hr />

					<h3>Användning</h3>

					<div className="about-menu">
						<a href="http://aroseniusarkivet.org/projekt/introduktion/">Introduktion</a>
						<a href="http://aroseniusarkivet.org/projekt/metadata-och-apier/">Metadata och API:er</a>
					</div>

					<small>Om inget annat anges så är arkivets material Public Domain.</small>

					<a href="#" className="arrow-link" onClick={
						function(event) {
							event.preventDefault();

							this.panelCloseHandler();
						}.bind(this)
					} />

				</div>

			</div>
		)
	}
}