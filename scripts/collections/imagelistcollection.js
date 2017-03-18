import 'whatwg-fetch';
import _ from 'underscore';

export default class ImageListCollection {
	constructor(url, onComplete) {
		this.url = url;
		this.onComplete = onComplete;
	}

	fetch(searchString, person) {
		if (this.url) {
			var fetchParams = [];
			if (searchString) {
				fetchParams.push('search='+searchString);
			}
			if (person) {
				fetchParams.push('person='+person);
			}

			fetch(this.url+(fetchParams.length > 0 ? '?'+fetchParams.join('&') : ''))
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