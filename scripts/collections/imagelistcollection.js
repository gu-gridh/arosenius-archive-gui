import 'whatwg-fetch';
import _ from 'underscore';

import config from './../config';

export default class ImageListCollection {
	constructor(onComplete) {
		this.url = config.apiUrl+config.endpoints.documents;
		this.lastUrl = '';

		this.onComplete = onComplete;

		this.loading = false;
	}

	fetch(params, count, page, append) {
		page = page || 1;

		this.currentPage = page;

		params = params || {};

		this.currentParams = params;

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

			fetchParams.push('page='+page);

			var url = this.url+(fetchParams.length > 0 ? '?'+fetchParams.join('&') : '');

			if (this.lastUrl == url) {
				return;
			}

			this.lastUrl = url;

			fetch(url)
				.then(function(response) {
					return response.json();
				}).then(function(json) {
					this.loading = false;
					if (this.onComplete) {
						this.onComplete({
							append: append,
							data: json
						});
					}
				}.bind(this)).catch(function(ex) {
					console.log('parsing failed', ex)
				})
			;
		}
	}
}