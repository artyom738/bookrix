import { BitrixVue } from 'ui.vue';
import './css/Book-Filters.css';

BitrixVue.component('bookrix-book-filters', {
	props: [],
	data()
	{
		return {
			authors: [],
			pages: {},
		};
	},
	created() {
		this.getAuthors();
		this.getLimitPages();
	},
	methods:
		{
			getAuthors()
			{
				BX.ajax.runAction('up:bookrix.bookcontroller.getAuthors')
					.then(response => {
						response.data.forEach(function(item) {
							this.authors.push(item);
						}, this);
					})
					.catch(response => console.error(response.errors));
			},

			getLimitPages() {
				BX.ajax.runAction('up:bookrix.bookcontroller.getMinMaxPages')
					.then(response => {
						this.pages.min = response.data.min;
						this.pages.max = response.data.max;
					});
			}

		},
	// language=Vue
	template: `
      <div class="bookrix-filters">
      <div class="bookrix-filter-title">Фильтры</div>
	  <div class="bookrix-filter">
		<div class="bookrix-filter-subtitle">Название книги</div>
        <div class="ui-ctl ui-ctl-textbox ui-ctl-w100">
          <input type="text" class="ui-ctl-element" name="book-name" id="book-name">
		</div>
	  </div>

      <div class="bookrix-filter">
        <div class="bookrix-filter-subtitle">Автор</div>
		<div class="bookrix-filter-authors">
          <template v-for="(item, index) in authors">
			<div class="bookrix-filter-author">
              <input type="checkbox" name="book-author" :id="item.ID">
              <label :for="item.ID">{{item.NAME}}</label>
			</div>
            
          </template>
		</div>
      </div>

      <div class="bookrix-filter">
        <div class="bookrix-filter-subtitle">Страниц</div>
		<div class="bookrix-filter-pages">
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
            <input type="text" class="ui-ctl-element" placeholder="от">
          </div>

          <div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
            <input type="text" class="ui-ctl-element" placeholder="до">
          </div>
		</div>
        
      </div>

      <div class="bookrix-filter">
        <div class="bookrix-filter-subtitle">Рейтинг</div>
        <div class="bookrix-filter-pages">
          <div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
            <input type="text" class="ui-ctl-element" placeholder="от">
          </div>

          <div class="ui-ctl ui-ctl-textbox ui-ctl-w33">
            <input type="text" class="ui-ctl-element" placeholder="до">
          </div>
        </div>
      </div>
      </div>
	`,
});