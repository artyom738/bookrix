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
	},
	methods: {
		loadBooks()
		{
			EventEmitter.subscribe('Bookrix.refreshBooks', (event) => {

			})
			let params = {
				'limit': 3,
				'order': { 'RATING': 'DESC' },
			}
			BooksGetter.getBooks(params).then(response => {
				this.books = response;
				this.title = 'Список книг';
			});
		},
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