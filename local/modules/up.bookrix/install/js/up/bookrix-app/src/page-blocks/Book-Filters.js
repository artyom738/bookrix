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
				authors: [],
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
		addAuthor(id)
		{
			if (BX.util.in_array(id, this.filters.authors))
			{
				const index = this.filters.authors.indexOf(id);
				this.filters.authors.splice(index, 1);
			}
			else
			{
				this.filters.authors.push(id);
			}
			return id;
		},
		reloadFilters()
		{
			EventEmitter.emit('Bookrix.refreshBooks').data({params: this.filters});
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
						<input type="checkbox" name="book-author" :id="item.ID" @click="addAuthor(item.ID)">
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