import { BitrixVue } from 'ui.vue';
import './Book-List';
import './Book-Filters';
import './Add-Book';
import './css/Page.css';

BitrixVue.component('bookrix-page', {
	props: ['componentName'],
	// language=Vue
	template: `
      <div class="page-container">
      <template v-if="componentName === 'main'">
        <bookrix-booklist :isMainPage="true"/>
      </template>

      <template v-if="componentName === 'add'">
        <bookrix-add-book/>
      </template>

      <template v-if="componentName === 'booklist'">
        <div class="booklist-container">
		  <bookrix-book-filters/>
		  
          <bookrix-booklist :isMainPage="false"/>
		  
        </div>
      </template>

      <template v-if="componentName === 'detailed'">
        <bookrix-book/>
      </template>
      </div>
	`,
});