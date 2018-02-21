import chroma from 'chroma-js';
import _ from 'underscore';

export default {
	getDominantHex(colorArray) {
		var sorted = _.sortBy(colorArray, function(item) {
			return item.score;
		});

		return chroma(sorted[sorted.length-1].color.red, sorted[sorted.length-1].color.green, sorted[sorted.length-1].color.blue).hex();
	}
}