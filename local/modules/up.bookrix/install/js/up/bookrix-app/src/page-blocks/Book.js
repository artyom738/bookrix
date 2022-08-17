import { BitrixVue } from 'ui.vue';
import './css/Book.css';
import { BooksGetter } from '../lib/get';

BitrixVue.component('bookrix-book', {
	props: ['book', 'showDesc', 'bookId'],
	data()
	{
		return {
			fieldsMap: {
				'AUTHORNAME': 'Автор',
				'RATING': 'Рейтинг',
				'PAGES': 'Страниц',
			},
		}
	},
	created()
	{
		this.loadBook();
	},
	methods: {
		getDate(date)
		{
			return BX.date.format('d F Y', date);
		},
		loadBook()
		{
			if (!this.book)
			{
				BooksGetter.getBookById(this.bookId).then(response => {
					this.book = response;
				});
			}
		},
	},
	// language=Vue
	template: `
		<div class="book-item">
			<div class="book-item-title" v-if="book.ID">
				<a v-bind:href="'/books/' + book.ID">{{ book.TITLE }}</a>
			</div>
			<div class="book-item-title" v-else>
				{{ book.TITLE }}
			</div>

			<template v-for="(value, index) in book">
				<div class="book-item-spec" v-if="(Object.keys(fieldsMap)).includes(index)">
					{{ fieldsMap[index] }}: {{value}}
				</div>
				<div class="book-item-spec" v-else-if="index === 'DATE_ADD'">
					Добавлена: {{getDate(value)}}
				</div>
				<div class="book-item-spec" v-else-if="index === 'DESCRIPTION' && showDesc">
					Описание: {{value}}
				</div>
			</template>
		</div>
	`,
});