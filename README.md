# The Ivar Arosenius archive frontend

Here is the source code for the Ivar Arosenius online archive (http://aroseniusarkivet.org).
The system consists of a Reach.js frontent, Express.js API that connects to Elasticsearch and a Backbone.js administration system.

The archive connects to an API which source code can be found here: https://github.com/CDH-DevTeam/arosenius-api
Here is an administration system for the archives data: https://github.com/CDH-DevTeam/arosenius-admin
The admin system uses the API to connect to Elasticsearch and add/update data.

## Getting started

To build the archive from the source code, first clone the repository or fork it to your own repository. Then install all JS dependencies and start `gulp` to build it.
```
git clone https://github.com/CDH-DevTeam/arosenius-archive-gui.git
cd arosenius-archive-gui
npm install
gulp
```

## Config file

The `scripts/config.js` file includes some configuration needed to run the archive.

```javascript
export default {
	apiUrl: '[url]', // link to the projects API
	imageUrl: '[api url]/images/', // link to the base image folder of the projects API

	adminUrl: '[url]', // link to the projects Administration system

	endpoints: { // API endpoints for various datatypes
		documents: 'documents',
		document: 'document/',
		autocomplete: 'autocomplete',

		tags: 'tags',
		persons: 'persons',
		places: 'places',
		genres: 'genres',
		museums: 'museums',
		types: 'types',
		year_range: 'year_range',
		googlevisionlabels: 'googlevisionlabels',
		tag_cloud: 'tags/cloud',

		colormap: 'colormap'
	}
};
```
