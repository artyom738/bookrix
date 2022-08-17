import { BitrixVue } from 'ui.vue';
import './css/Navbar.css';

BitrixVue.component('bookrix-navbar', {
	props: ['componentName', 'bookId'],
	data()
	{
		return {
			items: [],
		}
	},
	created()
	{
		this.loadItems(this.componentName);
	},
	methods: {
		getBookName()
		{
			return BX.ajax.runAction('up:bookrix.bookcontroller.getById', {data: { 'id': this.bookId } })
		},
		loadItems(componentName)
		{
			switch (componentName)
			{
				case 'main':
					this.items.push({'text': 'Главная', 'link': '/'});
					break;
				case 'add':
					this.items.push({'text': 'Главная', 'link': '/'});
					this.items.push({'text': 'Добавить книгу', 'link': '/add'});
					break;
				case 'booklist':
					this.items.push({'text': 'Главная', 'link': '/'});
					this.items.push({'text': 'Список книг', 'link': '/booklist'});
					break;
				case 'detailed':
					this.items.push({'text': 'Главная', 'link': '/'});
					this.items.push({'text': 'Список книг', 'link': '/booklist'});

					this.getBookName().then(response => {
						this.bookTitle = response.data['TITLE'];
						this.items.push({'text': this.bookTitle, 'link': '#'});
					});
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