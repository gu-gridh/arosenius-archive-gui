import 'whatwg-fetch';
import _ from 'underscore';

export default class ImageListCollection {
	constructor(url, onComplete) {
		this.url = url;
		this.onComplete = onComplete;
	}

	fetch() {
		if (this.url) {
			fetch(this.url)
				.then(function(response) {
					return response.json()
				}).then(function(json) {
					if (this.onComplete) {
						this.onComplete(json);
					}
				}.bind(this)).catch(function(ex) {
					console.log('parsing failed', ex)
				})
			;
		}
	}
}