import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

export default function ImageListItem(props) {
	return <a style={{backgroundColor: props.image.color.dominant.hex}} className="grid-item" key={props.image.id} href={'#image/'+props.image.id}>
		<img style={{transitionDelay: (props.index/80)+'s'}} src={'http://cdh-vir-1.it.gu.se:8004/images/255x/'+props.image.image+'.jpg'} />
		<div className="grid-title">{props.image.title}</div>
	</a>;
}