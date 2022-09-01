import { BitrixVue } from 'ui.vue';
import './css/Applied-Filters.css';
import { EventEmitter } from 'main.core.events';

BitrixVue.component('bookrix-applied-filters', {
	props: [],
	data()
	{
		return {
			filters: {},
		};
	},
	created()
	{
		EventEmitter.subscribe('Bookrix.refreshBooks', (event) => {
			this.filters = this.prepareFields(event.data.params);
		})
	},
	methods: {
		prepareFields(filters)
		{
			let result = {};
			for (let filterName in filters)
			{
				if (!filters[filterName])
				{
					continue;
				}

				switch (filterName)
				{
					case 'title':
						result.title = {
							'value': filters.title,
							'code': 'title',
							'name': 'Название',
						};
						break;
					case 'authors':
						let authors = [].concat(...Object.values(filters.authors)).join(', ')
						if (authors !== '')
						{
							result.authors = {
								'value': authors,
								'code': 'authors',
								'name': 'Авторы',
							};
						}
						break;
					case 'pagesMin':
						result.pagesMin = {
							'value': filters.pagesMin,
							'code': 'pagesMin',
							'name': 'Страниц от',
						};
						break;
					case 'pagesMax':
						result.pagesMax = {
							'value': filters.pagesMax,
							'code': 'pagesMax',
							'name': 'Страниц до',
						};
						break;
					case 'ratingMin':
						result.ratingMin = {
							'value': filters.ratingMin,
							'code': 'ratingMin',
							'name': 'Рейтинг от',
						};
						break;
					case 'ratingMax':
						result.ratingmax = {
							'value': filters.ratingMax,
							'code': 'ratingMax',
							'name': 'Рейтинг до',
						};
						break;
				}
			}
			return result;
		},
		resetFilter(key)
		{
			EventEmitter.emit('reset-filter', {item: this.filters[key]})
		},
		resetAllFilters(filters)
		{
			for (const object in filters)
			{
				this.resetFilter(object);
			}
		},
		isEmptyFilters()
		{
			if (!this.filters || Object.keys(this.filters).length === 0)
			{
				return true;
			}
			if (
				(this.filters.title === '' || this.filters.title === undefined)
				&& (this.filters.authors === undefined || Object.keys(this.filters.authors).length === 0)
				&& this.filters.pagesMin === null
				&& this.filters.pagesMax === null
				&& this.filters.ratingMin === null
				&& this.filters.ratingMax === null
			)
			{
				return true;
			}
			return false;
		}
	},
	// language=Vue
	template: `
		<div class="bookrix-apllied-filters" v-if="!isEmptyFilters()">
		<div class="bookrix-filter-title">Примененные фильтры:</div>
		
		<div class="bookrix-filter-item">Всего фильтров: {{ Object.keys(filters).length }}</div>
		<a
			class="bookrix-applied-filter-reset"
			@click="resetAllFilters(filters)"
		>(сбросить все)</a><br>
		
		<template v-for="(object, filterName) in filters">
			<div class="bookrix-filter-item" v-if="object.value">
				{{object.name}}: <b>{{object.value}}</b>
				<a 
					class="bookrix-applied-filter-reset"
					@click="resetFilter(object.code)"
				>(x)</a>
			</div>
		</template>
		</div>
	`,
});