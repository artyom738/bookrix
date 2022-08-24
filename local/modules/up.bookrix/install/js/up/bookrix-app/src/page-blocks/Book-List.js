import { BitrixVue } from 'ui.vue';
import './Book';
import './css/Book-List.css';
import './Applied-Filters';
import { BooksGetter } from '../lib/get';
import { EventEmitter } from 'main.core.events';


BitrixVue.component('bookrix-booklist', {
	props: ['isMainPage'],
	data()
	{
		return {
			books: [],
			arrayBooks: [],
			title: 'Загрузка...',
			filters: {},
		}
	},
	created()
	{
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
				if (response.length === 0)
				{
					this.title = 'По вашему запросу ничего не найдено!';
				}
				else
				{
					this.title = 'Список книг';
				}
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
				};
			}
			else if (!this.params)
			{
				this.params = {
				};
			}

			if (this.isMainPage)
			{
				this.params['order'] = {'RATING': 'DESC'}
			}
			else
			{
				this.params['order'] = {'DATE_ADD': 'DESC'}
			}
		},
	},

	// language=Vue
	template: `
		<div class="book-list">
		<bookrix-applied-filters/>
		<div class="book-list-title">
			{{title}}
		</div>
		<bookrix-book v-for="book in this.books" :book="book" :showDesc="!isMainPage"/>
		</div>
		`
});