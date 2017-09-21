export default {
	getImageUrl() {
		if (!window) {
			return 1000;
		}

		var windowWidth = window.innerWidth;

		if (windowWidth > 1200) {
			return 1600;
		}
		else if (windowWidth > 1000) {
			return 1200;
		}
		else if (windowWidth > 700) {
			return 1000;
		}
		else if (windowWidth > 500) {
			return 700;
		}
		else {
			return 500;
		}
	}
}