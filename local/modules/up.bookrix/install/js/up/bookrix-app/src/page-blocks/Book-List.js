import { BitrixVue } from 'ui.vue';
import './Book';
import './css/Book-List.css';
import './Applied-Filters';
import { BooksGetter } from '../lib/get';
import { EventEmitter } from 'main.core.events';
import { MessageBox } from 'ui.dialogs.messagebox';


BitrixVue.component('bookrix-booklist', {
	props: ['isMainPage'],
	data()
	{
		return {
			books: [],
			arrayBooks: [],
			title: 'Загрузка...',
			filters: {},
			booksForDelete: [],
		}
	},
	created()
	{
		this.loadBooks();
		EventEmitter.subscribe('Bookrix.refreshBooks', (event) => {
			this.params.filter = event.data.params;
			this.loadBooks();
		});
		EventEmitter.subscribe('Bookrix.switchBook', (event) => {
			this.addBookForDelete(event.data.bookId);
		});
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
		addBookForDelete(id)
		{
			if (!BX.util.in_array(id, this.booksForDelete))
			{
				this.booksForDelete.push(id)
			}
			else
			{
				const index = this.booksForDelete.indexOf(id);
				this.booksForDelete.splice(index, 1);
			}
		},
		showMessageBox()
		{
			const messageBox = new MessageBox(
				{
					message: "Вы действительно хотите удалить книги? (" + this.booksForDelete.length + ")",
					title: "Подтверждение удаления",
					buttons: BX.UI.Dialogs.MessageBoxButtons.OK_CANCEL,
					okCaption: "Да",
					onOk: () =>
					{
						BooksGetter.deleteBooks(this.booksForDelete)
						.then(response => {
							messageBox.close();
							window.location.reload();
						})
					},
				}
			);
			messageBox.show();
		}
	},

	// language=Vue
	template: `
		<div class="book-list">
		<bookrix-applied-filters/>
		<div class="book-list-deleting" v-if="booksForDelete.length > 0">Выбрано книг: {{this.booksForDelete.length}}
			<br><button class="ui-btn ui-btn-danger" @click="showMessageBox()">Удалить выбранные книги</button>
		</div>
		<div class="book-list-title">
			{{title}}
		</div>
		<bookrix-book v-for="book in this.books" :book="book" :showDesc="!isMainPage" :isDetailed="false"/>
		</div>
		`
});