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
			failed: {},
		};
	},
	methods: {
		checkFields()
		{
			this.failed = {};
			let fields = ['rating', 'author', 'pages', 'description', 'title'];
			for (const index in fields)
			{
				if (!BX.type.isNotEmptyString(this[fields[index]]))
				{
					this.failed[fields[index]] = {name: fields[index], errorMessage: 'Все поля обязательны к заполнению!', class: 'ui-ctl-danger'};
				}
			}
			if (!this.rating.match('^\\d{1,2}$|100'))
			{
				this.failed.rating = {name: fields.rating, errorMessage: 'Поле "Рейтинг" должно быть числом до 100', class: 'ui-ctl-danger'};
			}
			if (!this.pages.match('^\\d*$'))
			{
				this.failed.pages = {name: fields.pages, errorMessage: 'Поле "Страницы" должно быть числом', class: 'ui-ctl-danger'};
			}
		},

		save()
		{
			this.checkFields();
			console.log(this.failed);
			if (Object.keys(this.failed).length !== 0)
			{
				BX.UI.Notification.Center.notify({ content: this.failed[Object.keys(this.failed)[0]].errorMessage });
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
		},
		getFailedClass(name) {
			let result = BX.util.in_array(name, Object.keys(this.failed));
			return result ? 'ui-ctl-danger' : '';
		}
	},
	// language=Vue
	template: `
      <div class="add-container">
	  <div class="add-book-title">
		Добавление книги
	  </div>
      <div class="add-book">
        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75" :class="getFailedClass('title')">
            <input type="text" class="ui-ctl-element" v-model="title" placeholder="Название">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75" :class="getFailedClass('author')">
            <input type="text" class="ui-ctl-element" v-model="author" placeholder="Автор">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75" :class="getFailedClass('rating')">
            <input type="text" class="ui-ctl-element" v-model="rating" placeholder="Рейтинг">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75" :class="getFailedClass('pages')">
            <input type="text" class="ui-ctl-element" v-model="pages" placeholder="Страниц">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textarea" :class="getFailedClass('description')">
            <textarea class="ui-ctl-element" v-model="description" placeholder="Описание"></textarea>
          </div>
        </template>
        <br>
        <button class="ui-btn ui-btn-icon-add ui-btn-success" @click="save()">Сохранить</button>
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