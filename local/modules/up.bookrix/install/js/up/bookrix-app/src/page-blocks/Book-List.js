import { BitrixVue } from 'ui.vue';
import './Book';
import './css/Book-List.css';
import { BooksGetter } from '../lib/get';
import { EventEmitter } from 'main.core.events';


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
		EventEmitter.subscribe('Bookrix.refreshBooks', (event) => {
			this.params.filter = event.data.params;
			this.loadBooks();
		})
	},
	methods: {
		loadBooks()
		{
			this.getParams();
			BooksGetter.getBooks(this.params).then(response => {
				this.books = response;
				this.title = 'Список книг';
			})
			.catch(response => {
				console.error(response.errors);
			});
		},
		getParams()
		{
			if (this.isMainPage)
			{
				this.params = {
					'limit': 3,
					'order': { 'RATING': 'DESC' },
				};
			}
			else if (!this.params)
			{
				this.params = {
					'order': { 'RATING': 'DESC' },
				};
			}
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