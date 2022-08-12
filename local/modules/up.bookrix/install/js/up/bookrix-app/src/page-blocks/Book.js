import { BitrixVue } from 'ui.vue';
import './css/Book.css';

BitrixVue.component('bookrix-book', {
	props: ['book', 'showDesc', 'bookId'],
	data()
	{
		return {
			fieldsMap: {
				'AUTHORNAME': 'Автор',
				'RATING': 'Рейтинг',
				'PAGES': 'Страниц',
			}
		}
	},

	methods:
		{
			getDate(date)
			{
				return BX.date.format('d F Y', date)
			}
		},
	computed: {
		getBook()
		{
			if (!this.book)
			{
				BX.ajax.runAction('up:bookrix.bookcontroller.getById', {data: { 'id': this.bookId } })
					.then(response => {
						this.book = response.data;
						return response.data;
					})
					.catch(response => {
						console.error(response.errors);
					})
			}

			return this.book;
		}
	},
	mounted()
	{
		this.getBook();
	},
	// language=Vue
	template: `
		<div class="book-item">
			<div class="book-item-title">
			  <template v-if="book.ID">
              	<a v-bind:href="'/books/' + book.ID">{{ book.TITLE }}</a>
              </template>
			  <template v-else>
				{{ book.TITLE }}
			  </template>
			</div>
			
            <template v-for="(value, index) in book">
			  <template v-if="(Object.keys(fieldsMap)).includes(index)">
                <div class="book-item-spec">
				  {{ fieldsMap[index] }}: {{value}}
				</div>
			  </template>
			  <template v-else-if="index === 'DATE_ADD'">
				<div class="book-item-spec">
				  Добавлена:  {{getDate(value)}}
				</div>
			  </template>
			  <template v-else-if="index === 'DESCRIPTION' && showDesc">
                <div class="book-item-spec">
                  Описание:  {{value}}
                </div>
			  </template>
            </template>
		</div>
		`
});