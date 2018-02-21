import _ from 'underscore';

const libraryName = 'arosenius-arkivet';

export default {
	_getList() {
		return localStorage.getItem(libraryName) ? JSON.parse(localStorage.getItem(libraryName)) : [];
	},

	_saveList(list) {
		localStorage.setItem(libraryName, JSON.stringify(list));
	},

	add(item) {
		var storageList = this._getList();

		storageList.push(item);

		this._saveList(storageList);
	},

	remove(item) {
		var storageList = this._getList();

		storageList = _.reject(storageList, function(listItem) {
			if (typeof item == 'object') {
				return listItem.id == item.id;
			}
			else {
				return listItem.id == item;
			}
		});

		this._saveList(storageList);
	},

	find(item) {
		var storageList = this._getList();

		return _.findWhere(storageList, {
			id: item.id
		});
	},

	list() {
		return this._getList();
	}
};
