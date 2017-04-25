import 'whatwg-fetch';
import _ from 'underscore';

export default class ImageListCollection {
	constructor(url, onComplete) {
		this.url = url;
		this.onComplete = onComplete;

		this.loading = false;
	}

	// Search params:
	// searchString, person, place, tags, museum, genre, hue, saturation
	fetch(params, count) {

		params = params || {};

		if (this.url && !this.loading) {
			this.loading = true;

			var fetchParams = [];
			if (params.searchString) {
				fetchParams.push('search='+params.searchString);
			}
			if (params.person) {
				fetchParams.push('person='+params.person);
			}
			if (params.place) {
				fetchParams.push('place='+params.place);
			}
			if (params.museum) {
				fetchParams.push('museum='+params.museum);
			}
			if (params.genre) {
				fetchParams.push('genre='+params.genre);
			}
			if (params.tags) {
				fetchParams.push('tags='+params.tags);
			}
			if (params.hue) {
				fetchParams.push('hue='+params.hue);
			}
			if (params.saturation) {
				fetchParams.push('saturation='+params.saturation);
			}
			if (count) {
				fetchParams.push('count='+count);
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