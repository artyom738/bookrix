// noinspection HtmlUnknownAttribute

import { BitrixVue } from 'ui.vue';
import './css/Navbar.css';

BitrixVue.component('bookrix-navbar', {
	props: ['componentName'],
	data()
	{
		return {
			items: [],
		}
	},
	created() {

		this.loadItems(this.componentName);
	},
	methods:
		{
			loadItems(componentName)
			{
				switch (componentName)
				{
					case 'main':
						this.items.push({'text': '�������', 'link': '/'});
						break;
					case 'add':
						this.items.push({'text': '�������', 'link': '/'});
						this.items.push({'text': '�������� �����', 'link': '/add'});
						break;
					case 'booklist':
						this.items.push({'text': '�������', 'link': '/'});
						this.items.push({'text': '������ ����', 'link': '/booklist'});
						break;
					case 'detailed':
						this.items.push({'text': '�������', 'link': '/'});
						this.items.push({'text': '������ ����', 'link': '/booklist'});
						this.items.push({'text': '�������� �����', 'link': '#'});
						break;
				}
			},
		},
	// language=Vue
	template: `
      <div class="bookrix-navbar">
      <template v-for="(item, index) in this.items">
		<a v-bind:href="item.link">{{item.text}}</a>
		
		<template v-if="index < items.length - 1"> - </template>
	  </template>
      </div>
	`,
});