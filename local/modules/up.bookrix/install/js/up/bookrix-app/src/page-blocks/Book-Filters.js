import { BitrixVue } from 'ui.vue';
import './css/Book-Filters.css';
import { BooksGetter } from '../lib/get';
import { EventEmitter } from 'main.core.events';

BitrixVue.component('bookrix-book-filters', {
	props: [],
	data()
	{
		return {
			authors: [],
			pages: {},
			filters: {
				title: '',
				authors: {},
				pagesMin: null,
				pagesMax: null,
				ratingMin: null,
				ratingMax: null,
			},
		};
	},
	mounted()
	{
		EventEmitter.subscribe('reset-filter', (e) => {
			this.resetFilter(e.data.item.code);
		});

		this.getAuthors();

		BooksGetter.getMinMaxPages().then(response => {
			this.pagesMax = response.max;
		});
	},
	methods: {
		getAuthors()
		{
			BooksGetter.getAuthors().then(response => {
				this.authors = response;
			})
		},
		addAuthor(item)
		{
			if (BX.util.in_array(item.ID, BX.util.array_keys(this.filters.authors)))
			{
				delete this.filters.authors[item.ID];
			}
			else
			{
				this.filters.authors[item.ID] = item.NAME;
			}
			return item.ID;
		},
		resetAuthors()
		{
		},
		getAuthorClass(item)
		{
			return {
				'bookrix-filter-author-selected': BX.util.in_array(item.ID, BX.util.array_keys(this.filters.authors)),
			}
		},
		getPagesMax()
		{
			return this.pagesMax;
		},
		resetFilter(code)
		{
			switch (code)
			{
				case 'title':
					this.filters.title = '';
					break;
				case 'authors':
					this.filters.authors = {};
					this.resetAuthors();
					break;
				case 'pagesMin':
					this.filters.pagesMin = null;
					break;
				case 'pagesMax':
					this.filters.pagesMax = null;
					break;
				case 'ratingMin':
					this.filters.ratingMin = null;
					break;
				case 'ratingMax':
					this.filters.ratingMax = null;
					break;
			}
			this.reloadFilters();
		},
		reloadFilters()
		{
			EventEmitter.emit('Bookrix.refreshBooks', {params: this.filters});
		}
	},
	computed: {

	},
	// language=Vue
	template: `
		<div class="bookrix-filters">
			<div class="bookrix-filter-title">Фильтры</div>
			<div class="bookrix-filter">
				<div class="bookrix-filter-subtitle">Название книги</div>
				<div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
					<input 
						type="text" 
						class="ui-ctl-element" 
						name="book-name" 
						id="book-name" 
						v-model="filters.title"
					>
				</div>
			</div>

			<div class="bookrix-filter">
				<div class="bookrix-filter-subtitle">Автор</div>
				<div class="bookrix-filter-authors">
					<div
						class="bookrix-filter-author"
						:class="getAuthorClass(item)"
						v-for="item in authors"
						:id="item.ID"
						@click="addAuthor(item)"
					>
						{{item.NAME}}
					</div>
				</div>
			</div>

		<div class="bookrix-filter">
			<div class="bookrix-filter-subtitle">Страниц</div>
			<div class="bookrix-filter-pages">
				от 
				<div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
					
					<input 
						type="number" 
						class="ui-ctl-element"
						:placeholder="0"
						v-model="filters.pagesMin">
				</div>

				до 
				<div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
					
					<input 
						type="number" 
						class="ui-ctl-element"
						:placeholder="getPagesMax()"
						v-model="filters.pagesMax">
				</div>
			</div>

		</div>

		<div class="bookrix-filter">
			<div class="bookrix-filter-subtitle">Рейтинг</div>
			<div class="bookrix-filter-pages">
				от
				<div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
					
					<input 
						type="number" 
						class="ui-ctl-element" 
						placeholder="0" 
						v-model="filters.ratingMin">
				</div>
				до
				<div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
					
					<input 
						type="number" 
						class="ui-ctl-element" 
						placeholder="100" 
						v-model="filters.ratingMax">
				</div>
			</div>
		</div>
		<button class="ui-btn ui-btn-success" @click="reloadFilters">Найти</button>
		</div>
	`,
});