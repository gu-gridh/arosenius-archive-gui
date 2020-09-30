# The Ivar Arosenius archive frontend

A React.js frontend for the Ivar Arosenius online archive (http://aroseniusarkivet.org).

The frontend connects to a backend whose source code can be found here: https://github.com/CDH-DevTeam/arosenius-api

There is also an administration frontend for editing the data: https://github.com/CDH-DevTeam/arosenius-admin

## Getting started

To build the archive from the source code, first clone the repository or fork it to your own repository. Then install all JS dependencies and finally build the site.
Node 11 or _lower_ is required (12 will not work).

```sh
git clone https://github.com/CDH-DevTeam/arosenius-archive-gui.git
cd arosenius-archive-gui
nvm use # or otherwise make sure you are using Node <=11
npm install
# Create scripts/config.js (see below)
npm run dev
# Visit www/index.html in a web browser
```

Gulp outputs `www/scripts/app.js` and `www/css/style.css`. The site entry point is `www/index.html`; open it directly in a web browser or serve it with Nginx or similar.

When using `npm run dev`, the build process keeps watching source files and rebuilds instantly on changes.

## Config file

The `scripts/config.js` file must include some configuration needed to run the archive.
The `apiUrl` and `adminUrl` urls are expected to serve the aforementioned backend and administration frontend, respectively.
The `endpoints` parameters must agree with the routes specified in the backend code.

```javascript
export default {
	apiUrl: '[url]/', // link to the projects API
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
		tag_cloud: 'tags/cloud'
	}
};
```

## Deploying

Clone the repo to the server, create `scripts/config.js` and run the build.
(Again, make sure to use Node <=11.)

```sh
cd arosenius-archive-gui
git pull
nvm use
npm install
npm run build
```

Populate the `www/nearest_neighbors` and `www/tsne_data` directories with data from [arosenius-nearest-neighbors](https://github.com/CDH-DevTeam/arosenius-nearest-neighbors) (see instructions there).
