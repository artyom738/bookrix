import { BitrixVue } from 'ui.vue';
import './css/Book-Filters.css';
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
						result['��������: '] = filters.title;
						break;
					case 'authors':
						let authors = [].concat(...Object.values(filters.authors)).join(', ')
						if (authors !== '')
						{
							result['������: '] = authors;
						}
						break;
					case 'pages':
						result['������� ��: '] = filters.pages.min;
						result['������� ��: '] = filters.pages.max;
						break;
					case 'rating':
						result['������� ��: '] = filters.rating.min;
						result['������� ��: '] = filters.rating.max;
						break;
				}
			}
			return result;
		},
	},
	// language=Vue
	template: `
		<div class="bookrix-apllied-filters" v-if="filters && Object.keys(filters).length !== 0">
		<div class="bookrix-filter-title">����������� �������:</div>
		<template v-for="(value, key) in filters">
			<div class="bookrix-filter-item" v-if="value">
				{{key}} <b>{{value}}</b>
			</div>
		</template>
		</div>
	`,
});