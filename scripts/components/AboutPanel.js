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

	panelCloseHandler(target, event) {
		// If closing immediately, hide the div first and before setting open = false to avoid the css transition
		if (event && event.immediately) {
			this.setState({
				hidden: true
			}, function() {
				this.setState({
					open: false
				});

				setTimeout(function() {
					this.setState({
						hidden: false
					});
				}.bind(this), 1600);
			}.bind(this));
		}
		else {
			this.setState({
				open: false
			});
		}
	}

	render() {
		return (
			<div className={'about-panel'+(this.state.open ? ' open' : '')} style={this.state.hidden ? {display: 'none'} : {}}>
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

					<div className="about-menu top-row" style={{marginBottom: 0}}>
						<a href="https://www.gu.se/forskning/att-frammana-konstnaren-ur-arkiven-aroseniusprojektet">Läs om projektet</a>
					</div>

					<div className="about-menu bottom-row" style={{marginTop: 5, marginBottom: 60}}>
						<a href="https://aroseniusarkivet.dh.gu.se/arosenius/">Ivar Arosenius</a>
						<a href="https://aroseniusarkivet.dh.gu.se/forskning/">Forskning</a>
						<a href="https://aroseniusarkivet.dh.gu.se/personer/">Personer</a>
						
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

					<div className="about-menu top-row">
						<a href="hhttps://github.com/gu-gridh/documentation/blob/main/gridh-projects/arosenius.md#introduktion">Introduktion</a>
						<a href="https://github.com/gu-gridh/documentation/blob/main/gridh-projects/arosenius.md#metadata-och-apier">Metadata och API:er</a>
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
