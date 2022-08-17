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
				return '��� ���� ����������� � ����������!'
			}
			if (!this.rating.match('^\\d{1,2}$|100'))
			{
				return '���� "�������" ������ ���� ������ �� 100'
			}
			if (!this.pages.match('^\\d*$'))
			{
				return '���� "��������" ������ ���� ������'
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
					BX.UI.Notification.Center.notify({ content: "����� ���������!" });
					this.bookId = response.data['ID'];
					window.location = '/books/' + this.bookId;
					})
				.catch(response => {
					BX.UI.Notification.Center.notify({ content: "������ ���������� �����!" });
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
		���������� �����
	  </div>
      <div class="add-book">
        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75">
            <input type="text" class="ui-ctl-element" v-model="title" placeholder="��������">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75">
            <input type="text" class="ui-ctl-element" v-model="author" placeholder="�����">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75">
            <input type="text" class="ui-ctl-element" v-model="rating" placeholder="�������">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w75">
            <input type="text" class="ui-ctl-element" v-model="pages" placeholder="�������">
          </div>
        </template>

        <template>
          <div class="ui-ctl ui-ctl-textarea">
            <textarea class="ui-ctl-element" v-model="description" placeholder="��������"></textarea>
          </div>
        </template>
        <br>
        <button class="ui-btn ui-btn-icon-add ui-btn-success" v-on:click="save()">���������</button>
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