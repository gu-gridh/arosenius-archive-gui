import React from 'react';
import 'whatwg-fetch';
import _ from 'underscore';

export default function ImageListItem(props) {
	return <a className="grid-item" key={props.id} href={'#image/'+props.id}><img src={'http://cdh-vir-1.it.gu.se:8004/images/255x/'+props.file+'.jpg'} /></a>;
}