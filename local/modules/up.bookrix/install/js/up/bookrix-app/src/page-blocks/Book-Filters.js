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
				pages: {
					min: 0,
					max: 0,
				},
				rating: {
					min: 0,
					max: 100,
				}
			},
		};
	},
	mounted()
	{
		this.getAuthors();
		BooksGetter.getMinMaxPages().then(response => {
			this.filters.pages.max = response.max;
		})
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
		reloadFilters()
		{
			EventEmitter.emit('Bookrix.refreshBooks', {params: this.filters});
		}
	},
	// language=Vue
	template: `
		<div class="bookrix-filters">
			<div class="bookrix-filter-title">Фильтры</div>
			{{filters}}
			<div class="bookrix-filter">
				<div class="bookrix-filter-subtitle">Название книги</div>
				<div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
					<input type="text" class="ui-ctl-element" name="book-name" id="book-name" v-model="filters.title">
				</div>
			</div>

			<div class="bookrix-filter">
				<div class="bookrix-filter-subtitle">Автор</div>
				<div class="bookrix-filter-authors">
					<div class="bookrix-filter-author" v-for="(item, index) in authors">
						<input type="checkbox" name="book-author" :id="item.ID" @click="addAuthor(item)">
						<label :for="item.ID">{{item.NAME}}</label>
					</div>
				</div>
			</div>

		<div class="bookrix-filter">
			<div class="bookrix-filter-subtitle">Страниц</div>
			<div class="bookrix-filter-pages">
				<div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
					<input type="text" class="ui-ctl-element" placeholder="от" v-model="filters.pages.min">
				</div>

				<div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
					<input type="text" class="ui-ctl-element" placeholder="до"  v-model="filters.pages.max">
				</div>
			</div>

		</div>

		<div class="bookrix-filter">
			<div class="bookrix-filter-subtitle">Рейтинг</div>
			<div class="bookrix-filter-pages">
				<div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
					<input type="text" class="ui-ctl-element" placeholder="от" v-model="filters.rating.min">
				</div>

				<div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
					<input type="text" class="ui-ctl-element" placeholder="до" v-model="filters.rating.max">
				</div>
			</div>
		</div>
		<button class="ui-btn ui-btn-success" @click="reloadFilters">Найти</button>
		</div>
	`,
});