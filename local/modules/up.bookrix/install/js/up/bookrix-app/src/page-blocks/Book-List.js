import { BitrixVue } from 'ui.vue';
import './Book';
import './css/Book-List.css';

BitrixVue.component('bookrix-booklist', {
	props: ['isMainPage'],
	data() {
		return {
			books: [],
			arrayBooks: [],
			title: 'Загрузка...',
		}
	},
	created() {
		this.loadBooks();
	},
	methods:
	{
		loadBooks()
		{
			let params = {
				'limit': 3,
				'order': { 'RATING': 'DESC' },
			}
			BX.ajax.runAction('up:bookrix.bookcontroller.getBooks', {data: { params: params }})
				.then(response => {
					response.data.forEach(function(item) {
						this.books.push(item);
					}, this);
					this.title = 'Список книг';
			})
				.catch(response => console.error(response.errors))
		},

		getBooks() {
			this.books = [
				{
					"id": 50,
					"title": "111",
					"author": "dfdsf",
					"pages": "200",
				},
				{
					"id": 58,
					"title": "188",
					"author": "888",
					"pages": "57",
				}
			]
		}
	},

	// language=Vue
	template: `
		<div class="book-list">
		<div class="book-list-title">
		  {{title}}
		</div>
		<template v-for="book in this.books">
		  <bookrix-book :book="book" :showDesc="!isMainPage"/>
		</template>
		</div>
		`
});