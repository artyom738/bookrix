import { BitrixVue } from 'ui.vue';
import './Book';
import './css/Add-Book.css';

BitrixVue.component('bookrix-add-book', {
	data()
	{
		return {
			title: '',
			author: '',
			rating: '',
			pages: '',
			description: '',
			errorMessage: '',
		};
	},
	methods: {
		checkFields()
		{
			if (!BX.type.isNotEmptyString(this.rating) ||
				!BX.type.isNotEmptyString(this.author) ||
				!BX.type.isNotEmptyString(this.pages) ||
				!BX.type.isNotEmptyString(this.description) ||
				!BX.type.isNotEmptyString(this.title))
			{
				return 'Все поля обязательны к заполнению!'
			}
			if (!this.rating.match('^\\d{1,2}$|100'))
			{
				return 'Поле "Рейтинг" должно быть числом до 100'
			}
			if (!this.pages.match('^\\d*$'))
			{
				return 'Поле "Страницы" должно быть числом'
			}
			return '';
		},

		save()
		{
			let checkResult = this.checkFields();
			if (checkResult !== '')
			{
				BX.UI.Notification.Center.notify({ content: checkResult });
				return;
			}
			let params = {
				'TITLE': this.title,
				'AUTHOR': this.author,
				'RATING': this.rating,
				'PAGES': this.pages,
				'DESCRIPTION': this.description
			};

			BX.ajax.runAction('up:bookrix.bookcontroller.addBook', {data: { data: params }})
				.then(response => {
					BX.UI.Notification.Center.notify({ content: "Книга сохранена!" });
					this.bookId = response.data['ID'];
					window.location = '/books/' + this.bookId;
					})
				.catch(response => {
					BX.UI.Notification.Center.notify({ content: "Ошибка сохранения книги!" });
				});
			this.title = '';
			this.author = '';
			this.rating = '';
			this.pages = '';
			this.description = '';
		}
	},
	computed: {},
	// language=Vue
	template: `
      <div class="add-container">
	  <div class="add-book-title">
		Добавление книги
	  </div>
      <div class="add-book">
        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75">
            <input type="text" class="ui-ctl-element" v-model="title" placeholder="Название">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75">
            <input type="text" class="ui-ctl-element" v-model="author" placeholder="Автор">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75">
            <input type="text" class="ui-ctl-element" v-model="rating" placeholder="Рейтинг">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75">
            <input type="text" class="ui-ctl-element" v-model="pages" placeholder="Страниц">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textarea">
            <textarea class="ui-ctl-element" v-model="description" placeholder="Описание"></textarea>
          </div>
        </template>
        <br>
        <button class="ui-btn ui-btn-icon-add ui-btn-success" v-on:click="save()">Сохранить</button>
      </div>

      <bookrix-book :book="{
          'TITLE': title, 
          'AUTHORNAME': author, 
          'RATING': rating, 
          'PAGES': pages,
          'DESCRIPTION': description
      }" :showDesc="true"/>
      </div>
	`,
});