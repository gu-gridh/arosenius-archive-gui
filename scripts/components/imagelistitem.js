import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

export default function ImageListItem(props) {
	return <a style={{backgroundColor: props.image.images && props.image.images.length > 0 && props.image.images[0].color ? props.image.images[0].color.dominant.hex : '#333'}} className="grid-item" key={props.image.id} href={'#image/'+props.image.id}>
		<div className="image-wrapper">
			<img style={{transitionDelay: (props.index/80)+'s'}} src={'http://cdh-vir-1.it.gu.se:8004/images/255x/'+(props.image.images && props.image.images.length > 0 ? props.image.images[0].image : props.image.image ? props.image.image : '')+'.jpg'} />
		</div>
		<div className="grid-title">{props.image.title}</div>
	</a>;
}