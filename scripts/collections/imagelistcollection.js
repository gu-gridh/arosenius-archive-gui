import 'whatwg-fetch';
import _ from 'underscore';

export default class ImageListCollection {
	constructor(url, onComplete) {
		this.url = url;
		this.onComplete = onComplete;

		this.loading = false;
	}

	fetch(searchString, person, museum, hue, saturation) {
		if (this.url && !this.loading) {
			this.loading = true;

			var fetchParams = [];
			if (searchString) {
				fetchParams.push('search='+searchString);
			}
			if (person) {
				fetchParams.push('person='+person);
			}
			if (museum) {
				fetchParams.push('museum='+museum);
			}
			if (hue) {
				fetchParams.push('hue='+hue);
			}
			if (saturation) {
				fetchParams.push('saturation='+saturation);
			}

			fetch(this.url+(fetchParams.length > 0 ? '?'+fetchParams.join('&') : ''))
				.then(function(response) {
					return response.json();
				}).then(function(json) {
					this.loading = false;
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